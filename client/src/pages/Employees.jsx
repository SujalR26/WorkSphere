import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useUI } from '../context/UIContext.jsx';

// Design System
import Drawer from '../design-system/Drawer.jsx';
import Button from '../design-system/Button.jsx';
import Input from '../design-system/Input.jsx';
import Select from '../design-system/Select.jsx';
import Avatar from '../design-system/Avatar.jsx';
import Badge from '../design-system/Badge.jsx';
import Icons from '../design-system/Icons.jsx';
import TableLayout from '../layouts/TableLayout.jsx';
import Typography from '../design-system/Typography.jsx';
// APIs
import { getEmployeesApi, createEmployeeApi, updateEmployeeApi, deleteEmployeeApi } from '../api/employee.api.js';
import { getDepartmentsApi } from '../api/department.api.js';

// Form Component inside Employees.jsx
const EmployeeForm = ({ employee, departments = [], employees = [], onSuccess, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: employee ? {
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department?._id || '',
      designation: employee.designation,
      manager: employee.manager?._id || '',
      joiningDate: employee.joiningDate ? new Date(employee.joiningDate).toISOString().split('T')[0] : '',
      address: employee.address || '',
      avatar: employee.avatar || ''
    } : {
      name: '',
      email: '',
      phone: '',
      department: '',
      designation: '',
      manager: '',
      joiningDate: new Date().toISOString().split('T')[0],
      address: '',
      avatar: ''
    }
  });

  const queryClient = useQueryClient();
  const { showToast } = useUI();

  // Create/Update mutations
  const mutation = useMutation({
    mutationFn: (data) => {
      if (employee) {
        return updateEmployeeApi({ id: employee._id, ...data });
      }
      return createEmployeeApi(data);
    },
    onSuccess: (data) => {
      showToast(data.message, 'success');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      reset();
      onSuccess();
    },
    onError: (err) => {
      showToast(err.message, 'danger');
    }
  });

  const onSubmit = (data) => {
    // Clear manager and department string placeholders if empty
    if (!data.manager) delete data.manager;
    if (!data.department) delete data.department;
    mutation.mutate(data);
  };

  const deptOptions = departments.map(d => ({ value: d._id, label: `${d.name} (${d.code})` }));
  const managerOptions = employees
    .filter(e => !employee || e._id !== employee._id) // prevent managing oneself
    .map(e => ({ value: e._id, label: `${e.name} (${e.designation})` }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
      <Input
        label="Full Name"
        name="name"
        required
        error={errors.name?.message}
        {...register('name', { required: 'Name is required' })}
      />
      <Input
        label="Email Address"
        name="email"
        type="email"
        required
        error={errors.email?.message}
        {...register('email', {
          required: 'Email is required',
          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
        })}
      />
      <Input
        label="Phone Number"
        name="phone"
        required
        error={errors.phone?.message}
        {...register('phone', { required: 'Phone is required' })}
      />
      <Select
        label="Department"
        name="department"
        placeholder="Select Department"
        required
        error={errors.department?.message}
        options={deptOptions}
        {...register('department', { required: 'Department is required' })}
      />
      <Input
        label="Designation"
        name="designation"
        required
        error={errors.designation?.message}
        {...register('designation', { required: 'Designation is required' })}
      />
      <Select
        label="Manager"
        name="manager"
        placeholder="None (Top Level)"
        error={errors.manager?.message}
        options={managerOptions}
        {...register('manager')}
      />
      <Input
        label="Joining Date"
        name="joiningDate"
        type="date"
        required
        error={errors.joiningDate?.message}
        {...register('joiningDate', { required: 'Joining date is required' })}
      />
      <Input
        label="Avatar Photo URL"
        name="avatar"
        placeholder="https://randomuser.me/api/portraits/..."
        error={errors.avatar?.message}
        {...register('avatar')}
      />
      <Input
        label="Home Address"
        name="address"
        error={errors.address?.message}
        {...register('address')}
      />
      <div className="d-flex gap-2 justify-content-end mt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={mutation.isPending}>
          {employee ? 'Save Changes' : 'Add Employee'}
        </Button>
      </div>
    </form>
  );
};

export const Employees = () => {
  const queryClient = useQueryClient();
  const { activeDrawer, openDrawer, closeDrawer, showToast } = useUI();

  // Search & Pagination States
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [sort, setSort] = useState('name:asc');
  const [page, setPage] = useState(1);

  // 1. Fetch Employees
  const { data, isLoading } = useQuery({
    queryKey: ['employees', { search, department, sort, page }],
    queryFn: () => getEmployeesApi({ search, department, sort, page, limit: 10 }),
    keepPreviousData: true
  });

  // 2. Fetch Departments (for filter and dropdown)
  const { data: deptData } = useQuery({
    queryKey: ['departments'],
    queryFn: () => getDepartmentsApi()
  });

  // 3. Fetch all employees (for manager assignments)
  const { data: allEmployeesData } = useQuery({
    queryKey: ['employees-all-list'],
    queryFn: () => getEmployeesApi({ limit: 1000 })
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteEmployeeApi(id),
    onSuccess: (data) => {
      showToast(data.message, 'success');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (err) => {
      showToast(err.message, 'danger');
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this employee? This will also remove them from any managed departments.')) {
      deleteMutation.mutate(id);
    }
  };

  const employees = data?.employees || [];
  const pagination = data?.pagination;
  const departments = deptData?.departments || [];
  const allEmployees = allEmployeesData?.employees || [];

  const headers = [
    'Employee',
    'Email',
    'Phone',
    'Department',
    'Designation',
    'Manager',
    'Joining Date',
    'Actions'
  ];

  const filterElements = (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
      <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ maxWidth: '400px' }}>
        <div className="position-relative w-100">
          <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
            <Icons.Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="form-control rounded-pill border-ws-border ps-5 py-2 fs-7"
          />
        </div>
      </div>
      <div className="d-flex flex-wrap gap-2.5">
        <select
          value={department}
          onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
          className="form-select rounded-3 border-ws-border fs-7 py-2 px-3"
          style={{ width: '180px' }}
        >
          <option value="">All Departments</option>
          {departments.map(d => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="form-select rounded-3 border-ws-border fs-7 py-2 px-3"
          style={{ width: '180px' }}
        >
          <option value="name:asc">Name: A to Z</option>
          <option value="name:desc">Name: Z to A</option>
          <option value="joiningDate:desc">Newest Hired</option>
          <option value="joiningDate:asc">Oldest Hired</option>
        </select>
        <Button onClick={() => openDrawer('EMPLOYEE_CREATE')} icon={<Icons.Plus size={16} />}>
          Add Employee
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="d-flex flex-column gap-4 animate-fadeIn">
        <div className="d-flex align-items-center justify-content-between border-bottom pb-3">
          <div>
            <Typography variant="h2">Employee Directory</Typography>
            <Typography variant="body1">Search, organize, and manage employee records.</Typography>
          </div>
        </div>

        <TableLayout
          headers={headers}
          loading={isLoading}
          isEmpty={employees.length === 0}
          emptyIllustration="employees"
          emptyTitle="No Employees Found"
          emptyDescription="Start building your workforce directory by adding a new employee profile."
          emptyActionLabel="Add Employee"
          onEmptyAction={() => openDrawer('EMPLOYEE_CREATE')}
          pagination={pagination}
          onPageChange={setPage}
          filters={filterElements}
        >
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>
                <div className="d-flex align-items-center gap-3">
                  <Avatar src={emp.avatar} name={emp.name} size="sm" />
                  <span className="fw-semibold text-dark fs-7">{emp.name}</span>
                </div>
              </td>
              <td className="text-muted fs-7">{emp.email}</td>
              <td className="text-muted fs-7">{emp.phone}</td>
              <td>
                {emp.department ? (
                  <Badge variant="primary">{emp.department.name}</Badge>
                ) : (
                  <span className="text-muted fs-7">—</span>
                )}
              </td>
              <td className="text-muted fs-7">{emp.designation}</td>
              <td>
                {emp.manager ? (
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs-7 text-dark fw-medium">{emp.manager.name}</span>
                  </div>
                ) : (
                  <span className="text-muted fs-7">—</span>
                )}
              </td>
              <td className="text-muted fs-7">
                {new Date(emp.joiningDate).toLocaleDateString()}
              </td>
              <td>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    onClick={() => openDrawer('EMPLOYEE_EDIT', emp)}
                    className="btn btn-link text-ws-primary p-1 border-0 bg-transparent rounded-2"
                    title="Edit Profile"
                  >
                    <Icons.Edit size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(emp._id)}
                    className="btn btn-link text-ws-danger p-1 border-0 bg-transparent rounded-2"
                    title="Delete Employee"
                  >
                    <Icons.Trash size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </TableLayout>
      </div>

      {/* DRAWERS FOR CREATION / EDITING */}
      <Drawer
        isOpen={activeDrawer.type === 'EMPLOYEE_CREATE'}
        onClose={closeDrawer}
        title="Add New Employee"
      >
        <EmployeeForm
          departments={departments}
          employees={allEmployees}
          onSuccess={closeDrawer}
          onCancel={closeDrawer}
        />
      </Drawer>

      <Drawer
        isOpen={activeDrawer.type === 'EMPLOYEE_EDIT'}
        onClose={closeDrawer}
        title="Edit Employee Profile"
      >
        <EmployeeForm
          employee={activeDrawer.data}
          departments={departments}
          employees={allEmployees}
          onSuccess={closeDrawer}
          onCancel={closeDrawer}
        />
      </Drawer>
    </>
  );
};

export default Employees;

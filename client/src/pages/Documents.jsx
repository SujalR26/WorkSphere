import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useUI } from '../context/UIContext.jsx';

// Design System
import Modal from '../design-system/Modal.jsx';
import Button from '../design-system/Button.jsx';
import Input from '../design-system/Input.jsx';
import Select from '../design-system/Select.jsx';
import Card from '../design-system/Card.jsx';
import Typography from '../design-system/Typography.jsx';
import Badge from '../design-system/Badge.jsx';
import Avatar from '../design-system/Avatar.jsx';
import Icons from '../design-system/Icons.jsx';
import PageLayout from '../layouts/PageLayout.jsx';
import TableLayout from '../layouts/TableLayout.jsx';

// APIs
import { getDocumentsApi, createDocumentApi, deleteDocumentApi } from '../api/document.api.js';
import { getEmployeesApi } from '../api/employee.api.js';
import { getProjectsApi } from '../api/project.api.js';

const DocumentUploadForm = ({ employees = [], projects = [], onSuccess, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: '',
      category: 'Policy',
      uploadedBy: '',
      project: ''
    }
  });

  const queryClient = useQueryClient();
  const { showToast } = useUI();

  const mutation = useMutation({
    mutationFn: (data) => {
      // Simulate file upload by picking a random size between 200KB and 5MB
      const fileSize = Math.floor(Math.random() * 4800000) + 200000;
      
      const payload = {
        ...data,
        fileSize,
        fileUrl: `https://worksphere.com/files/${data.name.replace(/\s+/g, '_')}`
      };

      if (!payload.project) delete payload.project;
      
      return createDocumentApi(payload);
    },
    onSuccess: (data) => {
      showToast(data.message, 'success');
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      reset();
      onSuccess();
    },
    onError: (err) => {
      showToast(err.message, 'danger');
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const employeeOptions = employees.map(e => ({ value: e._id, label: e.name }));
  const projectOptions = projects.map(p => ({ value: p._id, label: p.name }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
      <Input
        label="Document Name (e.g. Handbook.pdf)"
        name="name"
        required
        error={errors.name?.message}
        {...register('name', { required: 'Document Name is required' })}
      />
      <Select
        label="Category"
        name="category"
        options={[
          { value: 'Policy', label: 'HR Policy / Guide' },
          { value: 'Project', label: 'Project File' },
          { value: 'Finance', label: 'Financial Sheet' },
          { value: 'Templates', label: 'Standard Template' }
        ]}
        {...register('category')}
      />
      <Select
        label="Uploading Employee"
        name="uploadedBy"
        placeholder="Select Employee"
        required
        error={errors.uploadedBy?.message}
        options={employeeOptions}
        {...register('uploadedBy', { required: 'Uploader is required' })}
      />
      <Select
        label="Linked Project (Optional)"
        name="project"
        placeholder="None"
        options={projectOptions}
        {...register('project')}
      />
      
      <div className="border border-dashed rounded-3 p-4 text-center bg-light my-2 cursor-pointer">
        <Icons.Upload size={32} className="text-ws-primary mb-2" />
        <p className="fs-8 text-muted mb-0 fw-medium">Drag files here or click to browse local files (UI Simulator only)</p>
      </div>

      <div className="d-flex gap-2 justify-content-end mt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={mutation.isPending}>
          Upload Document
        </Button>
      </div>
    </form>
  );
};

export const Documents = () => {
  const queryClient = useQueryClient();
  const { activeModal, openModal, closeModal, showToast } = useUI();
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [project, setProject] = useState('');

  // 1. Fetch Documents
  const { data: docsData, isLoading: docsLoading } = useQuery({
    queryKey: ['documents', { search, category, project }],
    queryFn: () => getDocumentsApi({ search, category, project })
  });

  // 2. Fetch Employees (for form uploader select)
  const { data: empData } = useQuery({
    queryKey: ['employees-list-all'],
    queryFn: () => getEmployeesApi({ limit: 1000 })
  });

  // 3. Fetch Projects (for filter & link options)
  const { data: projData } = useQuery({
    queryKey: ['projects-all-list'],
    queryFn: () => getProjectsApi({ limit: 1000 })
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteDocumentApi(id),
    onSuccess: (data) => {
      showToast(data.message, 'success');
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (err) => {
      showToast(err.message, 'danger');
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this document record?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleDownload = (doc) => {
    showToast(`Downloading file: ${doc.name}`, 'info');
    // Simulated trigger
  };

  const documents = docsData?.documents || [];
  const employees = empData?.employees || [];
  const projects = projData?.projects || [];

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const headers = [
    'Document Name',
    'Category',
    'File Size',
    'Linked Project',
    'Uploaded By',
    'Upload Date',
    'Actions'
  ];

  const filterElements = (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
      <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ maxWidth: '300px' }}>
        <div className="position-relative w-100">
          <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
            <Icons.Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control rounded-pill border-ws-border ps-5 py-2 fs-7"
          />
        </div>
      </div>
      <div className="d-flex flex-wrap gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-select rounded-3 border-ws-border fs-7 py-2"
          style={{ width: '150px' }}
        >
          <option value="">All Categories</option>
          <option value="Policy">HR Policy</option>
          <option value="Project">Project File</option>
          <option value="Finance">Finance</option>
          <option value="Templates">Templates</option>
        </select>
        <select
          value={project}
          onChange={(e) => setProject(e.target.value)}
          className="form-select rounded-3 border-ws-border fs-7 py-2"
          style={{ width: '150px' }}
        >
          <option value="">All Projects</option>
          {projects.map(p => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
        <Button onClick={() => openModal('DOCUMENT_UPLOAD')} icon={<Icons.Upload size={16} />}>
          Upload
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="d-flex flex-column gap-4 animate-fadeIn">
        <div className="d-flex align-items-center justify-content-between border-bottom pb-3">
          <div>
            <Typography variant="h2">Company Documents</Typography>
            <Typography variant="body1">Maintain shared HR handbooks, templates, and project materials.</Typography>
          </div>
        </div>

        <TableLayout
          headers={headers}
          loading={docsLoading}
          isEmpty={documents.length === 0}
          emptyIllustration="documents"
          emptyTitle="No Documents Found"
          emptyDescription="Upload policy sheets or templates to share with your organization."
          emptyActionLabel="Upload Document"
          onEmptyAction={() => openModal('DOCUMENT_UPLOAD')}
          filters={filterElements}
        >
          {documents.map((doc) => (
            <tr key={doc._id}>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <Icons.Documents className="text-ws-primary flex-shrink-0" size={18} />
                  <span className="fw-semibold text-dark fs-7">{doc.name}</span>
                </div>
              </td>
              <td>
                <Badge variant={doc.category === 'Policy' ? 'secondary' : 'info'}>
                  {doc.category}
                </Badge>
              </td>
              <td className="text-muted fs-7">
                {formatFileSize(doc.fileSize)}
              </td>
              <td className="text-dark fw-medium fs-7">
                {doc.project ? doc.project.name : '—'}
              </td>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <Avatar src={doc.uploadedBy?.avatar} name={doc.uploadedBy?.name} size="xs" />
                  <span className="fs-7 text-dark fw-medium">{doc.uploadedBy?.name || 'Uploader'}</span>
                </div>
              </td>
              <td className="text-muted fs-7">
                {new Date(doc.createdAt).toLocaleDateString()}
              </td>
              <td>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownload(doc)}
                    className="btn btn-link text-ws-primary p-1 border-0 bg-transparent rounded-2"
                    title="Download File"
                  >
                    <Icons.Download size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(doc._id)}
                    className="btn btn-link text-ws-danger p-1 border-0 bg-transparent rounded-2"
                    title="Delete Record"
                  >
                    <Icons.Trash size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </TableLayout>
      </div>

      {/* DOCUMENT UPLOAD MODAL */}
      <Modal
        isOpen={activeModal.type === 'DOCUMENT_UPLOAD'}
        onClose={closeModal}
        title="Upload Document Materials"
      >
        <DocumentUploadForm
          employees={employees}
          projects={projects}
          onSuccess={closeModal}
          onCancel={closeModal}
        />
      </Modal>
    </>
  );
};

export default Documents;

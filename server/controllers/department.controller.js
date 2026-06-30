import departmentService from '../services/department.service.js';

export const getDepartments = async (req, res, next) => {
  try {
    const { search } = req.query;
    const departments = await departmentService.getAll({ search });
    res.status(200).json({ success: true, departments });
  } catch (error) {
    next(error);
  }
};

export const getDepartmentById = async (req, res, next) => {
  try {
    const department = await departmentService.getById(req.params.id);
    res.status(200).json({ success: true, department });
  } catch (error) {
    next(error);
  }
};

export const createDepartment = async (req, res, next) => {
  try {
    const department = await departmentService.create(req.body);
    res.status(201).json({ success: true, department, message: 'Department created successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateDepartment = async (req, res, next) => {
  try {
    const department = await departmentService.update(req.params.id, req.body);
    res.status(200).json({ success: true, department, message: 'Department updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteDepartment = async (req, res, next) => {
  try {
    const department = await departmentService.delete(req.params.id);
    res.status(200).json({ success: true, department, message: 'Department deleted successfully' });
  } catch (error) {
    next(error);
  }
};

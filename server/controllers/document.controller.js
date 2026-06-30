import documentService from '../services/document.service.js';

export const getDocuments = async (req, res, next) => {
  try {
    const { category, search, project } = req.query;
    const documents = await documentService.getAll({ category, search, project });
    res.status(200).json({ success: true, documents });
  } catch (error) {
    next(error);
  }
};

export const getDocumentById = async (req, res, next) => {
  try {
    const document = await documentService.getById(req.params.id);
    res.status(200).json({ success: true, document });
  } catch (error) {
    next(error);
  }
};

export const createDocument = async (req, res, next) => {
  try {
    const document = await documentService.create(req.body);
    res.status(201).json({ success: true, document, message: 'Document uploaded successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const document = await documentService.delete(req.params.id);
    res.status(200).json({ success: true, document, message: 'Document deleted successfully' });
  } catch (error) {
    next(error);
  }
};

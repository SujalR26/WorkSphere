import express from 'express';
import {
  getDocuments,
  getDocumentById,
  createDocument,
  deleteDocument
} from '../controllers/document.controller.js';

const router = express.Router();

router.route('/')
  .get(getDocuments)
  .post(createDocument);

router.route('/:id')
  .get(getDocumentById)
  .delete(deleteDocument);

export default router;

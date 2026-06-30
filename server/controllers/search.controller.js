import searchService from '../services/search.service.js';

export const globalSearch = async (req, res, next) => {
  try {
    const { q } = req.query;
    const results = await searchService.searchAll(q);
    res.status(200).json({ success: true, results });
  } catch (error) {
    next(error);
  }
};

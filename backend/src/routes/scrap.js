import express from 'express';
import { fetchAllCompanies, fetchFilteredCompanies } from '../../controllers/scrap.js';

const router = express.Router();

router.post('/', fetchAllCompanies)
router.post('/prompt', fetchFilteredCompanies)

export default router
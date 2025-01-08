import express from 'express';
import { fetchAllCompanies } from '../../controllers/scrap.js';

const router = express.Router();

router.post('/', fetchAllCompanies)

export default router
import express from 'express';
import { fetchAllCompanies } from '../../controllers/scrap.js';

const router = express.Router();

router.get('/', fetchAllCompanies)

export default router
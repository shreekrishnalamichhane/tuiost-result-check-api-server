import express from 'express';
const router = express.Router();

import ResultController from '../Controllers/ResultController';

router.get('/options', ResultController.options);
router.get('/check', ResultController.check);

export default router;

import express from 'express';
const router = express.Router();

import IntroController from '../Controllers/IntroController';

router.get('/', IntroController.intro);

export default router;

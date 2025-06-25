import express from 'express';
import controller from '../controllers/controller.js';


const router = express.Router();
router.get('/message',controller.getMessage);

export default router;


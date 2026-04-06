import express from 'express'
import { login, signup } from '../controllers/User';
const router  = express.Router();

router.post('/login' , login);
router.post('/register' , signup);


export default router;


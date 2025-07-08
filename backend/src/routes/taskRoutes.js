import express from 'express'
import { create, update, deleteTask, getAllTasks, assignTask, smartAssignTask } from '../controllers/taskController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create', protectRoute, create);
router.patch('/update/:id', protectRoute, update);
router.delete('/delete/:id', protectRoute, deleteTask); 
router.get('/all', protectRoute, getAllTasks);
router.post('/assign/:id', protectRoute, assignTask);
router.post('/smart-assign/:id', protectRoute, smartAssignTask);

export default router;
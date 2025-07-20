import { Router } from 'express';
import { createMessageController, getRoomMessagesController } from '../controllers/message';
import authorize from '../middlewares/authorize'; 

const router = Router();

router.use(authorize);

router.route('/:roomId/messages')
  .post(createMessageController) 
  .get(getRoomMessagesController);

export default router;

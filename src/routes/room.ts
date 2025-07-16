import { Router } from "express";
import {
  createRoomController,
  getAllRoomsController,
  getRoomByIdController,
  updateRoomController,
  deleteRoomController,
  getRoomsOfUserController,
  joinRoomController,
} from "../controllers/room";
import authorize from "../middlewares/authorize";

const router = Router();

router.use(authorize);

router.route("/").post(createRoomController).get(getAllRoomsController);

router.get('/my-rooms', getRoomsOfUserController);

router
  .route("/:id")
  .get(getRoomByIdController)
  .patch(updateRoomController)
  .delete(deleteRoomController);

router.route("/:id/join").post(joinRoomController);

export default router;

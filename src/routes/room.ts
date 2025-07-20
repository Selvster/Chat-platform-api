import { Router } from "express";
import {
  createRoomController,
  getAllRoomsController,
  getRoomByIdController,
  updateRoomController,
  deleteRoomController,
  getRoomsOfUserController,
  joinRoomController,
  leaveRoomController
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

router.route("/:code/join").post(joinRoomController);

router.route("/:id/leave").post(leaveRoomController);

export default router;

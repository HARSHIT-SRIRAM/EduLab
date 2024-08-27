import { Router } from "express";
import { EventController } from "../Controllers/eventController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();
const eventController = new EventController();

router.post(
  "/create-events",
  authenticate,
  eventController.createEvent.bind(eventController)
);
router.get(
  "/get-events/:id",
  eventController.getEventById.bind(eventController)
);
router.put(
  "/update-events/:id",
  authenticate,
  eventController.updateEvent.bind(eventController)
);
router.delete(
  "/delete-events/:id",
  authenticate,
  eventController.deleteEvent.bind(eventController)
);

export default router;

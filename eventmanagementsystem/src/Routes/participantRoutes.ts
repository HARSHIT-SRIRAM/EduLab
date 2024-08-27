import { Router } from "express";
import { ParticipantController } from "../Controllers/participantController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();
const participantController = new ParticipantController();

router.post(
  "/create-participant/:id",
  authenticate,
  participantController.createParticipant.bind(participantController)
);

router.get(
  "/events-by-user",
  authenticate,
  participantController.getEventsByUser.bind(participantController)
);

router.delete(
  "/unregister/:eventId",
  authenticate,
  participantController.unregisterParticipant.bind(participantController)
);

export default router;

import { Response } from "express";
import { ParticipantService } from "../Services/participantService";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

const participantService = new ParticipantService();

export class ParticipantController {
  async createParticipant(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    const eventId = parseInt(req.params.id, 10);
    if (isNaN(eventId)) {
      res.status(400).json({ error: "Invalid Event ID" });
      return;
    }

    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userId = req.user.id;
    try {
      await participantService.createParticipant(eventId, userId);
      res.status(201).json({
        message: "You have successfully registered for the event",
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getEventsByUser(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userId = req.user.id;
    try {
      const events = await participantService.getEventsByUserId(userId);
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async unregisterParticipant(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    const eventId = parseInt(req.params.eventId, 10);
    if (isNaN(eventId)) {
      res.status(400).json({ error: "Invalid Event ID" });
      return;
    }

    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userId = req.user.id;
    try {
      const isRegistered = await participantService.isUserRegistered(
        eventId,
        userId
      );
      if (!isRegistered) {
        res
          .status(400)
          .json({ error: "You are not registered for this event" });
        return;
      }

      await participantService.unregisterParticipant(eventId, userId);
      res
        .status(200)
        .json({ message: "User successfully unregistered from the event" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

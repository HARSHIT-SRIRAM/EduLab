import { Request, Response } from "express";
import { EventService } from "../Services/eventService";
import { Event } from "../Models/event";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

const eventService = new EventService();

const handleError = (res: Response, error: Error) => {
  res.status(500).json({
    success: false,
    message: error.message || "Internal server error",
  });
};

export class EventController {
  async createEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const eventData: Partial<Event> = req.body;
      const result = await eventService.createEvent(eventData, req.user);
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      handleError(res, error as Error);
    }
  }

  async getEventById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await eventService.getEventById(id, req.user);
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      handleError(res, error as Error);
    }
  }

  async updateEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const updateData: Partial<Event> = req.body;
      const result = await eventService.updateEvent(id, updateData, req.user);
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      handleError(res, error as Error);
    }
  }

  async deleteEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await eventService.deleteEvent(id, req.user);
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      handleError(res, error as Error);
    }
  }
}

import { Participant } from "../Models/participant";
import { Event } from "../Models/event";
import { User } from "../Models/users";
import { AppDataSource } from "../../src/DatabaseConfig/dbConfig";

export class ParticipantService {
  private participantRepository = AppDataSource.getRepository(Participant);
  private eventRepository = AppDataSource.getRepository(Event);
  private userRepository = AppDataSource.getRepository(User);

  async createParticipant(
    eventId: number,
    userId: number
  ): Promise<Participant> {
    if (!eventId || !userId) {
      throw new Error("Event ID and User ID are required");
    }

    const event = await this.eventRepository.findOneBy({ id: eventId });
    if (!event) {
      throw new Error(`Event with ID ${eventId} not found`);
    }

    const existingParticipant = await this.participantRepository.findOne({
      where: {
        event: { id: eventId },
        user: { id: userId },
      },
    });

    if (existingParticipant) {
      throw new Error("You have already registered for this event");
    }

    const participantCount = await this.participantRepository.count({
      where: { event: { id: eventId } },
    });

    const participantLimit = event.participantLimit;
    if (participantCount >= participantLimit) {
      throw new Error(
        `Event with ID ${eventId} has reached its maximum number of participants`
      );
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    try {
      const participant = this.participantRepository.create({
        event,
        user,
      });
      return await this.participantRepository.save(participant);
    } catch (error) {
      console.error("Error creating participant:", error);
      throw new Error("Error saving participant to database");
    }
  }

  async getEventsByUserId(userId: number): Promise<Event[]> {
    try {
      const participants = await this.participantRepository.find({
        where: { user: { id: userId } },
        relations: ["event"],
      });

      const events = participants.map((participant) => participant.event);
      return events;
    } catch (error) {
      console.error("Error fetching events by user ID:", error);
      throw new Error("Error fetching events from database");
    }
  }

  async unregisterParticipant(eventId: number, userId: number): Promise<void> {
    if (!eventId || !userId) {
      throw new Error("Event ID and User ID are required");
    }

    const participant = await this.participantRepository.findOne({
      where: {
        event: { id: eventId },
        user: { id: userId },
      },
    });

    if (!participant) {
      throw new Error(
        `Participant with Event ID ${eventId} and User ID ${userId} not found`
      );
    }

    try {
      await this.participantRepository.remove(participant);
    } catch (error) {
      console.error("Error unregistering participant:", error);
      throw new Error("Error removing participant from event");
    }
  }

  async isUserRegistered(eventId: number, userId: number): Promise<boolean> {
    if (!eventId || !userId) {
      throw new Error("Event ID and User ID are required");
    }

    const participant = await this.participantRepository.findOne({
      where: {
        event: { id: eventId },
        user: { id: userId },
      },
    });

    return !!participant;
  }
}

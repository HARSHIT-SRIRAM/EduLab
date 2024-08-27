import { Repository } from "typeorm";
import { AppDataSource } from "../DatabaseConfig/dbConfig";
import { Event } from "../Models/event";
import { User } from "../Models/users";

interface ServiceResponse<T> {
  success: boolean;
  data?: T | null;
  message?: string;
}

class EventService {
  private eventRepository: Repository<Event> =
    AppDataSource.getRepository(Event);

  private async findEventById(id: number): Promise<Event | null> {
    return await this.eventRepository.findOne({
      where: { id },
      relations: ["user"],
    });
  }

  private createResponse<T>(
    success: boolean,
    data?: T | null,
    message?: string
  ): ServiceResponse<T> {
    return { success, data, message };
  }

  private sanitizeUser(user: any): any {
    if (user) {
      const { password, phoneNumber, ...userWithoutSensitiveInfo } = user;
      return userWithoutSensitiveInfo;
    }
    return user;
  }

  private isUserAuthorized(event: Event, user?: User): boolean {
    return !!(user && event.user && event.user.id === user.id);
  }

  async createEvent(
    eventData: Partial<Event>,
    user?: User
  ): Promise<ServiceResponse<Event | null>> {
    if (!eventData) {
      return this.createResponse(false, null, "Event data is missing");
    }

    const missingFields = [
      "name",
      "description",
      "location",
      "date",
      "eventStartTime",
    ].filter((field) => !eventData[field as keyof Event]);

    if (missingFields.length > 0) {
      return this.createResponse(
        false,
        null,
        `Missing required fields: ${missingFields.join(", ")}`
      );
    }

    try {
      const event = this.eventRepository.create(eventData);

      if (user) {
        event.user = user;
      }

      const savedEvent = await this.eventRepository.save(event);
      savedEvent.user = this.sanitizeUser(savedEvent.user);

      return this.createResponse(true, savedEvent);
    } catch (error) {
      return this.createResponse(false, null, "Error saving event to database");
    }
  }

  async getEventById(
    id: number,
    user?: User
  ): Promise<ServiceResponse<Event | null>> {
    try {
      const event = await this.findEventById(id);
      if (!event) {
        return this.createResponse(
          false,
          null,
          `Event with ID ${id} not found`
        );
      }
      event.user = this.sanitizeUser(event.user);

      return this.createResponse(true, event);
    } catch (error) {
      return this.createResponse(
        false,
        null,
        "Error fetching event from database"
      );
    }
  }

  async updateEvent(
    id: number,
    updateData: Partial<Event>,
    user?: User
  ): Promise<ServiceResponse<Event | null>> {
    try {
      const event = await this.findEventById(id);

      if (!event) {
        return this.createResponse(false, null, "Event not found");
      }

      if (!this.isUserAuthorized(event, user)) {
        return this.createResponse(false, null, "Unauthorized access");
      }

      await this.eventRepository.update(id, updateData);
      const updatedEvent = await this.findEventById(id);
      if (updatedEvent) {
        updatedEvent.user = this.sanitizeUser(updatedEvent.user);
      }

      return this.createResponse(true, updatedEvent);
    } catch (error) {
      return this.createResponse(
        false,
        null,
        "Error updating event in database"
      );
    }
  }

  async deleteEvent(id: number, user?: User): Promise<ServiceResponse<void>> {
    try {
      const event = await this.findEventById(id);

      if (!event) {
        return this.createResponse(false, undefined, "Event not found");
      }

      if (!this.isUserAuthorized(event, user)) {
        return this.createResponse(false, undefined, "Unauthorized access");
      }

      const result = await this.eventRepository.delete(id);
      if (result.affected === 0) {
        return this.createResponse(false, undefined, "Event not found");
      }

      return this.createResponse(true, undefined, "Event deleted successfully");
    } catch (error) {
      return this.createResponse(
        false,
        undefined,
        "Error deleting event from database"
      );
    }
  }
}

export { EventService };

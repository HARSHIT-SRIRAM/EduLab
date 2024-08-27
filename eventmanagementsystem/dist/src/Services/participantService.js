"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipantService = void 0;
const participant_1 = require("../Models/participant");
const event_1 = require("../Models/event");
const users_1 = require("../Models/users");
const dbConfig_1 = require("../../src/DatabaseConfig/dbConfig");
class ParticipantService {
    constructor() {
        this.participantRepository = dbConfig_1.AppDataSource.getRepository(participant_1.Participant);
        this.eventRepository = dbConfig_1.AppDataSource.getRepository(event_1.Event);
        this.userRepository = dbConfig_1.AppDataSource.getRepository(users_1.User);
    }
    createParticipant(eventId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!eventId || !userId) {
                throw new Error("Event ID and User ID are required");
            }
            const event = yield this.eventRepository.findOneBy({ id: eventId });
            if (!event) {
                throw new Error(`Event with ID ${eventId} not found`);
            }
            const existingParticipant = yield this.participantRepository.findOne({
                where: {
                    event: { id: eventId },
                    user: { id: userId },
                },
            });
            if (existingParticipant) {
                throw new Error("You have already registered for this event");
            }
            const participantCount = yield this.participantRepository.count({
                where: { event: { id: eventId } },
            });
            const participantLimit = event.participantLimit;
            if (participantCount >= participantLimit) {
                throw new Error(`Event with ID ${eventId} has reached its maximum number of participants`);
            }
            const user = yield this.userRepository.findOneBy({ id: userId });
            if (!user) {
                throw new Error(`User with ID ${userId} not found`);
            }
            try {
                const participant = this.participantRepository.create({
                    event,
                    user,
                });
                return yield this.participantRepository.save(participant);
            }
            catch (error) {
                console.error("Error creating participant:", error);
                throw new Error("Error saving participant to database");
            }
        });
    }
    getEventsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const participants = yield this.participantRepository.find({
                    where: { user: { id: userId } },
                    relations: ["event"],
                });
                const events = participants.map((participant) => participant.event);
                return events;
            }
            catch (error) {
                console.error("Error fetching events by user ID:", error);
                throw new Error("Error fetching events from database");
            }
        });
    }
    unregisterParticipant(eventId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!eventId || !userId) {
                throw new Error("Event ID and User ID are required");
            }
            const participant = yield this.participantRepository.findOne({
                where: {
                    event: { id: eventId },
                    user: { id: userId },
                },
            });
            if (!participant) {
                throw new Error(`Participant with Event ID ${eventId} and User ID ${userId} not found`);
            }
            try {
                yield this.participantRepository.remove(participant);
            }
            catch (error) {
                console.error("Error unregistering participant:", error);
                throw new Error("Error removing participant from event");
            }
        });
    }
    isUserRegistered(eventId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!eventId || !userId) {
                throw new Error("Event ID and User ID are required");
            }
            const participant = yield this.participantRepository.findOne({
                where: {
                    event: { id: eventId },
                    user: { id: userId },
                },
            });
            return !!participant;
        });
    }
}
exports.ParticipantService = ParticipantService;
//# sourceMappingURL=participantService.js.map
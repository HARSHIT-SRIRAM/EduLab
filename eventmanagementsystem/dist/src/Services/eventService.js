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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const dbConfig_1 = require("../DatabaseConfig/dbConfig");
const event_1 = require("../Models/event");
class EventService {
    constructor() {
        this.eventRepository = dbConfig_1.AppDataSource.getRepository(event_1.Event);
    }
    findEventById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.eventRepository.findOne({
                where: { id },
                relations: ["user"],
            });
        });
    }
    createResponse(success, data, message) {
        return { success, data, message };
    }
    sanitizeUser(user) {
        if (user) {
            const { password, phoneNumber } = user, userWithoutSensitiveInfo = __rest(user, ["password", "phoneNumber"]);
            return userWithoutSensitiveInfo;
        }
        return user;
    }
    isUserAuthorized(event, user) {
        return !!(user && event.user && event.user.id === user.id);
    }
    createEvent(eventData, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!eventData) {
                return this.createResponse(false, null, "Event data is missing");
            }
            const missingFields = [
                "name",
                "description",
                "location",
                "date",
                "eventStartTime",
            ].filter((field) => !eventData[field]);
            if (missingFields.length > 0) {
                return this.createResponse(false, null, `Missing required fields: ${missingFields.join(", ")}`);
            }
            try {
                const event = this.eventRepository.create(eventData);
                if (user) {
                    event.user = user;
                }
                const savedEvent = yield this.eventRepository.save(event);
                savedEvent.user = this.sanitizeUser(savedEvent.user);
                return this.createResponse(true, savedEvent);
            }
            catch (error) {
                return this.createResponse(false, null, "Error saving event to database");
            }
        });
    }
    getEventById(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = yield this.findEventById(id);
                if (!event) {
                    return this.createResponse(false, null, `Event with ID ${id} not found`);
                }
                event.user = this.sanitizeUser(event.user);
                return this.createResponse(true, event);
            }
            catch (error) {
                return this.createResponse(false, null, "Error fetching event from database");
            }
        });
    }
    updateEvent(id, updateData, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = yield this.findEventById(id);
                if (!event) {
                    return this.createResponse(false, null, "Event not found");
                }
                if (!this.isUserAuthorized(event, user)) {
                    return this.createResponse(false, null, "Unauthorized access");
                }
                yield this.eventRepository.update(id, updateData);
                const updatedEvent = yield this.findEventById(id);
                if (updatedEvent) {
                    updatedEvent.user = this.sanitizeUser(updatedEvent.user);
                }
                return this.createResponse(true, updatedEvent);
            }
            catch (error) {
                return this.createResponse(false, null, "Error updating event in database");
            }
        });
    }
    deleteEvent(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = yield this.findEventById(id);
                if (!event) {
                    return this.createResponse(false, undefined, "Event not found");
                }
                if (!this.isUserAuthorized(event, user)) {
                    return this.createResponse(false, undefined, "Unauthorized access");
                }
                const result = yield this.eventRepository.delete(id);
                if (result.affected === 0) {
                    return this.createResponse(false, undefined, "Event not found");
                }
                return this.createResponse(true, undefined, "Event deleted successfully");
            }
            catch (error) {
                return this.createResponse(false, undefined, "Error deleting event from database");
            }
        });
    }
}
exports.EventService = EventService;
//# sourceMappingURL=eventService.js.map
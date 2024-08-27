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
exports.ParticipantController = void 0;
const participantService_1 = require("../Services/participantService");
const participantService = new participantService_1.ParticipantService();
class ParticipantController {
    createParticipant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                yield participantService.createParticipant(eventId, userId);
                res.status(201).json({
                    message: "You have successfully registered for the event",
                });
            }
            catch (error) {
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    getEventsByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const userId = req.user.id;
            try {
                const events = yield participantService.getEventsByUserId(userId);
                res.status(200).json(events);
            }
            catch (error) {
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    unregisterParticipant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const isRegistered = yield participantService.isUserRegistered(eventId, userId);
                if (!isRegistered) {
                    res
                        .status(400)
                        .json({ error: "You are not registered for this event" });
                    return;
                }
                yield participantService.unregisterParticipant(eventId, userId);
                res
                    .status(200)
                    .json({ message: "User successfully unregistered from the event" });
            }
            catch (error) {
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
}
exports.ParticipantController = ParticipantController;
//# sourceMappingURL=participantController.js.map
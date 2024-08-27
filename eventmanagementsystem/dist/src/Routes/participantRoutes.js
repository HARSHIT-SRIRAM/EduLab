"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const participantController_1 = require("../Controllers/participantController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const participantController = new participantController_1.ParticipantController();
router.post("/create-participant/:id", authMiddleware_1.authenticate, participantController.createParticipant.bind(participantController));
router.get("/events-by-user", authMiddleware_1.authenticate, participantController.getEventsByUser.bind(participantController));
router.delete("/unregister/:eventId", authMiddleware_1.authenticate, participantController.unregisterParticipant.bind(participantController));
exports.default = router;
//# sourceMappingURL=participantRoutes.js.map
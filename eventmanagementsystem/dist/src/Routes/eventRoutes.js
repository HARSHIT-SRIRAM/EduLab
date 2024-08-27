"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("../Controllers/eventController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const eventController = new eventController_1.EventController();
router.post("/create-events", authMiddleware_1.authenticate, eventController.createEvent.bind(eventController));
router.get("/get-events/:id", eventController.getEventById.bind(eventController));
router.put("/update-events/:id", authMiddleware_1.authenticate, eventController.updateEvent.bind(eventController));
router.delete("/delete-events/:id", authMiddleware_1.authenticate, eventController.deleteEvent.bind(eventController));
exports.default = router;
//# sourceMappingURL=eventRoutes.js.map
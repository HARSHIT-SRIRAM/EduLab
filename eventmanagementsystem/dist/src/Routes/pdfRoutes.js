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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const dbConfig_1 = require("../../src/DatabaseConfig/dbConfig");
const event_1 = require("../Models/event");
const router = express_1.default.Router();
function getAllEvents() {
    return __awaiter(this, void 0, void 0, function* () {
        const eventRepository = dbConfig_1.AppDataSource.getRepository(event_1.Event);
        try {
            return yield eventRepository.find({
                relations: ["participants", "participants.user"],
            });
        }
        catch (error) {
            console.error("Error fetching events:", error);
            throw new Error("Error fetching events from database");
        }
    });
}
function generateEventPdf(events) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default();
            const buffers = [];
            doc.on("data", buffers.push.bind(buffers));
            doc.on("end", () => resolve(Buffer.concat(buffers)));
            doc.fontSize(20).text("Event Report", { align: "center" });
            doc.moveDown();
            events.forEach((event) => {
                doc
                    .fontSize(16)
                    .text(`Event Name: ${event.name}`, { underline: true })
                    .text(`Location: ${event.location}`)
                    .text(`Date: ${event.date}`)
                    .text(`Start Time: ${event.eventStartTime.toLocaleString()}`)
                    .text(`Participant Limit: ${event.participantLimit}`)
                    .moveDown();
                if (event.participants.length > 0) {
                    doc.fontSize(14).text("Participants:", { underline: true });
                    event.participants.forEach((participant) => {
                        const user = participant.user;
                        doc
                            .fontSize(12)
                            .text(`Name: ${user.name}`, { continued: true })
                            .text(` | Email: ${user.email}`, { continued: true })
                            .text(` | Phone: ${user.phoneNumber || "N/A"}`);
                    });
                }
                else {
                    doc.fontSize(12).text("No participants registered.");
                }
                doc.moveDown();
            });
            doc.end();
        });
    });
}
router.post("/generate-events-pdf", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield getAllEvents();
        if (events.length === 0) {
            return res.status(404).json({ error: "No events found" });
        }
        const pdfBuffer = yield generateEventPdf(events);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="events.pdf"`);
        res.send(pdfBuffer);
    }
    catch (error) {
        console.error("Error generating events PDF:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
exports.default = router;
//# sourceMappingURL=pdfRoutes.js.map
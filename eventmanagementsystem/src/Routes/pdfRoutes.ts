import express, { Request, Response } from "express";
import PDFDocument from "pdfkit";
import { AppDataSource } from "../../src/DatabaseConfig/dbConfig";
import { Event } from "../Models/event";
import { Participant } from "../Models/participant";

const router = express.Router();

async function getAllEvents(): Promise<Event[]> {
  const eventRepository = AppDataSource.getRepository(Event);
  try {
    return await eventRepository.find({
      relations: ["participants", "participants.user"],
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error("Error fetching events from database");
  }
}

async function generateEventPdf(events: Event[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

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
      } else {
        doc.fontSize(12).text("No participants registered.");
      }
      doc.moveDown();
    });

    doc.end();
  });
}

router.post("/generate-events-pdf", async (req: Request, res: Response) => {
  try {
    const events = await getAllEvents();

    if (events.length === 0) {
      return res.status(404).json({ error: "No events found" });
    }

    const pdfBuffer = await generateEventPdf(events);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="events.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating events PDF:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

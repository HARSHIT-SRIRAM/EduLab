import express from "express";
import { connectToDatabase } from "./src/DatabaseConfig/dbConfig";
import userRoutes from "./src/Routes/userRoutes";
import eventRoutes from "./src/Routes/eventRoutes";
import participantRoutes from "./src/Routes/participantRoutes";
import pdfRouter from "./src/Routes/pdfRoutes";

const app = express();
const PORT = 5000;
app.use(express.json());

app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/participants", participantRoutes);
app.use("/generatepdf", pdfRouter);

const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

startServer();

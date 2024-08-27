import { DataSource } from "typeorm";
import { Event } from "../Models/event";
import { Participant } from "../Models/participant";
import { User } from "../Models/users";
import path from "path";

const dbPath = path.resolve(__dirname, "../DatabaseConfig/event_management.db");

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: dbPath,
  entities: [User, Event, Participant],
  synchronize: true,
});

export const connectToDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("1 Error connecting to the database:", error);
    throw error;
  }
};

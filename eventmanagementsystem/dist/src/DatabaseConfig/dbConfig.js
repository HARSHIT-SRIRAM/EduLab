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
exports.connectToDatabase = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const event_1 = require("../Models/event");
const participant_1 = require("../Models/participant");
const users_1 = require("../Models/users");
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.resolve(__dirname, "../DatabaseConfig/event_management.db");
console.log(`Database path resolved to: ${dbPath}`);
exports.AppDataSource = new typeorm_1.DataSource({
    type: "sqlite",
    database: dbPath,
    entities: [users_1.User, event_1.Event, participant_1.Participant],
    synchronize: true,
});
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.AppDataSource.initialize();
        console.log("Database connected successfully");
    }
    catch (error) {
        console.error("1 Error connecting to the database:", error.message);
        if (error.code === "SQLITE_CANTOPEN") {
            console.error("Detailed Error:", error.message);
        }
        throw error;
    }
});
exports.connectToDatabase = connectToDatabase;
//# sourceMappingURL=dbConfig.js.map
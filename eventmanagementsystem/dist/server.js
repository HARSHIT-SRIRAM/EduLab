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
const dbConfig_1 = require("./src/DatabaseConfig/dbConfig");
const userRoutes_1 = __importDefault(require("./src/Routes/userRoutes"));
const eventRoutes_1 = __importDefault(require("./src/Routes/eventRoutes"));
const participantRoutes_1 = __importDefault(require("./src/Routes/participantRoutes"));
const pdfRoutes_1 = __importDefault(require("./src/Routes/pdfRoutes"));
const app = (0, express_1.default)();
const PORT = 5000;
app.use(express_1.default.json());
app.use("/users", userRoutes_1.default);
app.use("/events", eventRoutes_1.default);
app.use("/participants", participantRoutes_1.default);
app.use("/generatepdf", pdfRoutes_1.default);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, dbConfig_1.connectToDatabase)();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Error starting the server:", error);
        process.exit(1);
    }
});
startServer();
//# sourceMappingURL=server.js.map
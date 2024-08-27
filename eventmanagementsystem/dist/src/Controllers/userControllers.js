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
exports.UserController = void 0;
const userService_1 = require("../Services/userService");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserController {
    constructor() {
        this.userService = userService_1.UserService;
    }
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const result = yield this.userService.createUser(userData);
                if (result.success && result.user) {
                    res.status(201).json({
                        message: "User registered successfully",
                        user: {
                            id: result.user.id,
                            email: result.user.email,
                            name: result.user.name,
                            phoneNumber: result.user.phoneNumber,
                            createdAt: result.user.createdAt,
                            updatedAt: result.user.updatedAt,
                        },
                    });
                }
                else {
                    res
                        .status(400)
                        .json({ message: result.message || "User registration failed" });
                }
            }
            catch (error) {
                console.error("Error registering user:", error);
                res
                    .status(500)
                    .json({ error: error.message || "Internal server error" });
            }
        });
    }
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const result = yield this.userService.getUserByEmail(email);
                if (result.success &&
                    result.user &&
                    (yield bcrypt_1.default.compare(password, result.user.password))) {
                    const token = jsonwebtoken_1.default.sign({ id: result.user.id, email: result.user.email }, "EventManagement", { expiresIn: "30d" });
                    res.status(200).json({
                        message: "Login successful",
                        token,
                    });
                }
                else {
                    res.status(401).json({ message: "Invalid credentials" });
                }
            }
            catch (error) {
                console.error("Error logging in user:", error);
                res
                    .status(500)
                    .json({ error: error.message || "Internal server error" });
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id, 10);
                const result = yield this.userService.getUserById(id);
                if (result.success && result.user) {
                    res.status(200).json(result.user);
                }
                else {
                    res.status(404).json({ message: result.message || "User not found" });
                }
            }
            catch (error) {
                console.error("Error fetching user by ID:", error);
                res
                    .status(500)
                    .json({ error: error.message || "Internal server error" });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id, 10);
                const updateData = req.body;
                const result = yield this.userService.updateUser(id, updateData);
                if (result.success && result.user) {
                    res.status(200).json(result.user);
                }
                else {
                    res.status(404).json({ message: result.message || "User not found" });
                }
            }
            catch (error) {
                console.error("Error updating user:", error);
                res
                    .status(500)
                    .json({ error: error.message || "Internal server error" });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id, 10);
                const result = yield this.userService.deleteUser(id);
                if (result.success) {
                    res
                        .status(200)
                        .json({ message: result.message || "User deleted successfully" });
                }
                else {
                    res.status(404).json({ message: result.message || "User not found" });
                }
            }
            catch (error) {
                console.error("Error deleting user:", error);
                res
                    .status(500)
                    .json({ error: error.message || "Internal server error" });
            }
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=userControllers.js.map
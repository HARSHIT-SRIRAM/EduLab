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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_1 = require("../Models/users");
const dbConfig_1 = require("../../src/DatabaseConfig/dbConfig");
const userRepository = dbConfig_1.AppDataSource.getRepository(users_1.User);
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userData.email || !userData.name || !userData.password) {
        return {
            success: false,
            message: "Missing required fields: email, name, and password are required",
        };
    }
    try {
        const existingUser = yield userRepository.findOneBy({
            email: userData.email,
        });
        if (existingUser) {
            return {
                success: false,
                message: "Email is already in use",
            };
        }
        const hashedPassword = yield bcrypt_1.default.hash(userData.password, 10);
        const user = userRepository.create(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
        const savedUser = yield userRepository.save(user);
        return { success: true, user: savedUser };
    }
    catch (error) {
        console.error("Error creating user:", error);
        return { success: false, message: "Internal server error" };
    }
});
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userRepository.findOneBy({ id });
        if (!user) {
            return { success: false, message: `User with ID ${id} not found` };
        }
        const { password } = user, userWithoutPassword = __rest(user, ["password"]);
        return { success: true, user: userWithoutPassword };
    }
    catch (error) {
        console.error("Error fetching user by ID:", error);
        return { success: false, message: "Internal server error" };
    }
});
const updateUser = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield userRepository.update(id, updateData);
        if (result.affected === 0) {
            return { success: false, message: `User with ID ${id} not found` };
        }
        const user = yield userRepository.findOneBy({ id });
        if (!user) {
            return { success: false, message: `User with ID ${id} not found` };
        }
        const { password } = user, userWithoutPassword = __rest(user, ["password"]);
        return { success: true, user: userWithoutPassword };
    }
    catch (error) {
        console.error("Error updating user:", error);
        return { success: false, message: "Internal server error" };
    }
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield userRepository.delete(id);
        if (result.affected === 0) {
            return { success: false, message: `User with ID ${id} not found` };
        }
        return { success: true, message: "User deleted successfully" };
    }
    catch (error) {
        console.error("Error deleting user:", error);
        return { success: false, message: "Internal server error" };
    }
});
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userRepository.findOneBy({ email });
        if (!user) {
            return { success: false, message: `User with email ${email} not found` };
        }
        return { success: true, user };
    }
    catch (error) {
        console.error("Error fetching user by email:", error);
        return { success: false, message: "Internal server error" };
    }
});
exports.UserService = {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    getUserByEmail,
};
//# sourceMappingURL=userService.js.map
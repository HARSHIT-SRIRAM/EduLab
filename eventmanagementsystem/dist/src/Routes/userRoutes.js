"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControllers_1 = require("../Controllers/userControllers");
const router = (0, express_1.Router)();
const userController = new userControllers_1.UserController();
router.post("/register", userController.registerUser.bind(userController));
router.post("/login", userController.loginUser.bind(userController));
router.get("/getbyuserid/:id", userController.getUserById.bind(userController));
router.put("/updateuser/:id", userController.updateUser.bind(userController));
router.delete("/delete/:id", userController.deleteUser.bind(userController));
exports.default = router;
//# sourceMappingURL=userRoutes.js.map
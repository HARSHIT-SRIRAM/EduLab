import { Router } from "express";
import { UserController } from "../Controllers/userControllers";

const router = Router();
const userController = new UserController();

router.post("/register", userController.registerUser.bind(userController));

router.post("/login", userController.loginUser.bind(userController));

router.get("/getbyuserid/:id", userController.getUserById.bind(userController));

router.put("/updateuser/:id", userController.updateUser.bind(userController));

router.delete("/delete/:id", userController.deleteUser.bind(userController));

export default router;

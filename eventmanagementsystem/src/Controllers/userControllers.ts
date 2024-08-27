import { Request, Response } from "express";
import { UserService } from "../Services/userService";
import { User } from "../Models/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserController {
  private userService = UserService;

  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: Partial<User> = req.body;
      const result = await this.userService.createUser(userData);

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
      } else {
        res
          .status(400)
          .json({ message: result.message || "User registration failed" });
      }
    } catch (error) {
      console.error("Error registering user:", error);
      res
        .status(500)
        .json({ error: (error as Error).message || "Internal server error" });
    }
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this.userService.getUserByEmail(email);

      if (
        result.success &&
        result.user &&
        (await bcrypt.compare(password, result.user.password))
      ) {
        const token = jwt.sign(
          { id: result.user.id, email: result.user.email },
          "EventManagement",
          { expiresIn: "30d" }
        );

        res.status(200).json({
          message: "Login successful",
          token,
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Error logging in user:", error);
      res
        .status(500)
        .json({ error: (error as Error).message || "Internal server error" });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await this.userService.getUserById(id);

      if (result.success && result.user) {
        res.status(200).json(result.user);
      } else {
        res.status(404).json({ message: result.message || "User not found" });
      }
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      res
        .status(500)
        .json({ error: (error as Error).message || "Internal server error" });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const updateData: Partial<User> = req.body;
      const result = await this.userService.updateUser(id, updateData);

      if (result.success && result.user) {
        res.status(200).json(result.user);
      } else {
        res.status(404).json({ message: result.message || "User not found" });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      res
        .status(500)
        .json({ error: (error as Error).message || "Internal server error" });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await this.userService.deleteUser(id);

      if (result.success) {
        res
          .status(200)
          .json({ message: result.message || "User deleted successfully" });
      } else {
        res.status(404).json({ message: result.message || "User not found" });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      res
        .status(500)
        .json({ error: (error as Error).message || "Internal server error" });
    }
  }
}

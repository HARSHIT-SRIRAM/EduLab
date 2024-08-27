import bcrypt from "bcrypt";
import { User } from "../Models/users";
import { AppDataSource } from "../../src/DatabaseConfig/dbConfig";

const userRepository = AppDataSource.getRepository(User);

const createUser = async (
  userData: Partial<User>
): Promise<{ success: boolean; message?: string; user?: User }> => {
  if (!userData.email || !userData.name || !userData.password) {
    return {
      success: false,
      message:
        "Missing required fields: email, name, and password are required",
    };
  }

  try {
    const existingUser = await userRepository.findOneBy({
      email: userData.email,
    });

    if (existingUser) {
      return {
        success: false,
        message: "Email is already in use",
      };
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const savedUser = await userRepository.save(user);
    return { success: true, user: savedUser };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, message: "Internal server error" };
  }
};

const getUserById = async (
  id: number
): Promise<{
  success: boolean;
  message?: string;
  user?: Omit<User, "password">;
}> => {
  try {
    const user = await userRepository.findOneBy({ id });

    if (!user) {
      return { success: false, message: `User with ID ${id} not found` };
    }

    const { password, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return { success: false, message: "Internal server error" };
  }
};

const updateUser = async (
  id: number,
  updateData: Partial<User>
): Promise<{
  success: boolean;
  message?: string;
  user?: Omit<User, "password">;
}> => {
  try {
    const result = await userRepository.update(id, updateData);
    if (result.affected === 0) {
      return { success: false, message: `User with ID ${id} not found` };
    }

    const user = await userRepository.findOneBy({ id });
    if (!user) {
      return { success: false, message: `User with ID ${id} not found` };
    }

    const { password, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, message: "Internal server error" };
  }
};

const deleteUser = async (
  id: number
): Promise<{ success: boolean; message?: string }> => {
  try {
    const result = await userRepository.delete(id);
    if (result.affected === 0) {
      return { success: false, message: `User with ID ${id} not found` };
    }

    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, message: "Internal server error" };
  }
};

const getUserByEmail = async (
  email: string
): Promise<{ success: boolean; message?: string; user?: User }> => {
  try {
    const user = await userRepository.findOneBy({ email });
    if (!user) {
      return { success: false, message: `User with email ${email} not found` };
    }

    return { success: true, user };
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return { success: false, message: "Internal server error" };
  }
};

export const UserService = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
};

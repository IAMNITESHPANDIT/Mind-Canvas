import { connectToDatabase } from "@lib/mongodb";
import Registration from "@models/Registration";
import bcrypt from "bcrypt";
import { generateToken } from "@lib/auth";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, password, number, role, image } = req.body;

    try {
      const { db } = await connectToDatabase();

      // Convert the provided email to lowercase
      const normalizedEmail = email.toLowerCase();

      // Check for existing user with case-insensitive email
      const existingUser = await Registration.findOne({
        email: normalizedEmail,
      });

      if (existingUser) {
        res.status(400).json({ message: "Email is already registered" });
        return;
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const registration = new Registration({
        name,
        email: normalizedEmail, // Store the normalized email
        password: hashedPassword,
        number,
        role: "user",
        image,
      });

      const newUser = await registration.save();

      // Generate JWT token
      const token = generateToken(newUser._id, newUser.role);

      res.status(201).json({
        message: `${role} is registered successfully`,
        user: newUser,
        token,
      });
    } catch (error) {
      console.error("Failed to register:", error);
      res.status(500).json({ error: "Failed to register" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

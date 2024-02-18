import { generateToken } from "@lib/auth";
import { connectToDatabase } from "@lib/mongodb";
import Registration from "@models/Registration";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, password, number, role, image } = req.body;

    try {
      const { db } = await connectToDatabase();
      const existingUser = await Registration.findOne({ email });

      if (existingUser) {
        res.status(400).json({ message: "Email is already registered" });
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const registration = new Registration({
        name,
        email,
        password: hashedPassword,
        number,
        role,
        image,
      });

      const newUser = await registration.save();

      // Generate JWT token
      const token = generateToken(newUser._id, newUser.role);
      // const token = jwt.sign({ userId: newUser._id }, secretKey, {
      //   expiresIn: "1h",
      // });

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

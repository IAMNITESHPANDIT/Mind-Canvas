import Registration from "@models/Registration";
import { generateToken } from "@lib/auth";
import { connectToDatabase } from "@lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      const normalizedEmail = email.toLowerCase();

      const { db } = await connectToDatabase();
      let user = await Registration.findOne({ email: normalizedEmail });

      if (!user) {
        res
          .status(401)
          .json({ error: "Invalid email or password", user: null });
        return;
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res
          .status(401)
          .json({ error: "Invalid email or password", user: null });
        return;
      }

      const token = generateToken(user._id, user.role);
      // Fetch associated registration details and posts
      let userReg = JSON.stringify(user);
      let m = JSON.parse(userReg);
      m.accessToken = token;
      m.ok = true;
      m.success = true;
      res.status(200).json({ ...m });
    } catch (error) {
      console.error("Failed to login:", error);
      res
        .status(500)
        .json({ error: "Failed to login", ok: false, success: false });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

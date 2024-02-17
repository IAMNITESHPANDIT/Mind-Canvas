import Registration from "@models/Registration";
import { generateToken, generateRefreshToken } from "@lib/auth";
import { connectToDatabase } from "@lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      const normalizedEmail = email.toLowerCase();
      await connectToDatabase();
      let user = await Registration.findOne({ email: normalizedEmail });

      if (!user) {
        res
          .status(401)
          .json({ error: "Invalid email or password", user: null });
        return;
      }

      const isPasswordValid = await user.comparePassword(password.toString());
      if (!isPasswordValid) {
        res
          .status(401)
          .json({ error: "Invalid email or password", user: null });
        return;
      }

      const accessToken = generateToken(user._id, user.role);

      const refreshToken = generateRefreshToken(user._id);

      user.refreshToken = refreshToken;

      await user.save();

      let userReg = JSON.stringify(user);
      let m = JSON.parse(userReg);
      m.accessToken = accessToken;
      m.refreshToken = refreshToken;
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

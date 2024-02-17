import { generateToken, verifyToken } from "@lib/auth";
import Registration from "@models/Registration";

export default async function refreshHandler(req, res) {
  if (req.method === "POST") {
    const { refreshToken } = req.body;

    try {
      const decodedToken = verifyToken(refreshToken);

      const user = await Registration.findOne({ _id: decodedToken.userId, refreshToken: refreshToken });

      if (!user) {
        throw new Error("Invalid refresh token");
      }

      const accessToken = generateToken(user._id, user.role);

      res.status(200).json({ accessToken });
    } catch (error) {
      res.status(401).json({ error: "Invalid refresh token" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

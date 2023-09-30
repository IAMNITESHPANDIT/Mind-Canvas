import { verifyToken } from "@lib/auth";
import { connectToDatabase } from "@lib/mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  if (req.method === "PATCH") {
    const { postId, newData } = req.body;

    const post = await db.collection("posts").findOne({ _id: postId });
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const token = req.headers.authorization.split("Bearer ")[1];
    const decoded = verifyToken(token);

    if (post.userId !== decoded.userId && decoded.role !== "admin") {
      res
        .status(403)
        .json({ message: "You are not authorized to update this post" });
      return;
    }
    await db.collection("posts").updateOne({ _id: postId }, { $set: newData });
    res.status(200).json({ message: "Post updated successfully" });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

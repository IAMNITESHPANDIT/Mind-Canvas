import { verifyToken } from "@lib/auth";
import { connectToDatabase } from "@lib/mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  if (req.method === "GET") {
    const token = req.headers.authorization.split("Bearer ")[1];
    const decoded = verifyToken(token);
    const posts = await db.collection("posts").find().toArray();

    if (!posts) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const modifiedPosts = posts.map((post) => ({
      ...post,
      isDelete: decoded?.userId == post?.userId || decoded?.role == "admin",
    }));

    res.status(200).json({
      message: "Posts successfully Fetched",
      data: modifiedPosts,
    });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

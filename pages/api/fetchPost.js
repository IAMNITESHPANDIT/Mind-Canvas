import { verifyToken } from "@lib/auth";
import { connectToDatabase } from "@lib/mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  if (req.method === "GET") {
    try {
      const token = req.headers.authorization?.split("Bearer ")[1];
      const decoded = token && verifyToken(token);
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      let posts = await db
        .collection("posts")
        .find()
        .sort({ createdAt: -1 })
        .toArray();

      if (!posts || posts.length === 0) {
        res.status(200).json({ message: "No posts found", data: [] });
        return;
      }

      posts.sort((a, b) => b.createdAt - a.createdAt);

      if (decoded) {
        const userPosts = posts.filter((post) => post.userId === decoded.userId);
        const otherPosts = posts.filter((post) => post.userId !== decoded.userId);
        posts = [...userPosts, ...otherPosts];
      }

      const total = posts.length;

      const modifiedPosts = posts.map((post) => ({
        ...post,
        isDelete: decoded?.userId == post?.userId || decoded?.role == "admin",
      }));

      const paginatedPosts = modifiedPosts.slice(skip, skip + limit);

      res.status(200).json({
        message: "Posts successfully fetched",
        data: paginatedPosts,
        total: total,
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

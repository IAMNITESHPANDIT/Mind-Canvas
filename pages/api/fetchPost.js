import { verifyToken } from "@lib/auth";
import { connectToDatabase } from "@lib/mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  if (req.method === "GET") {
    const token = req.headers.authorization.split("Bearer ")[1];
    const decoded = verifyToken(token);
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Adjust the limit as per your requirement

    const skip = (page - 1) * limit;

    // Fetch posts for the current page
    const posts = await db
      .collection("posts")
      .find()
      .skip(skip)
      .limit(limit)
      .toArray();

    // Count total number of posts
    const total = await db.collection("posts").countDocuments();

    if (!posts) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const modifiedPosts = posts.map((post) => ({
      ...post,
      isDelete: decoded?.userId == post?.userId || decoded?.role == "admin",
    }));

    res.status(200).json({
      message: "Posts successfully fetched",
      data: modifiedPosts,
      total: total,
    });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

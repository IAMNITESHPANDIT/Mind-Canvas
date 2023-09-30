import { connectToDatabase } from "@lib/mongodb";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  if (req.method === "POST") {
    const { title, description, hashtag, role, image } = req.body;
    const token = req.headers.authorization;
    const defulatImage =
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&w=1000&q=80";

    if (!token) {
      res.status(401).json({ error: "Missing token" });
      return;
    }

    try {
      // Extract the token from the "Bearer <token>" format
      const extractedToken = token.split(" ")[1];

      // Verify and decode the token
      const decodedToken = jwt.verify(extractedToken, process.env.JWT_SECRET);

      // Access the user ID from the decoded token
      const userId = decodedToken.userId;

      // Create the post object
      const post = {
        title,
        description,
        hashtag,
        userId,
        role,
        image: image || defulatImage,
      };

      // Insert the post into the database
      const result = await db.collection("posts").insertOne(post);

      res.status(201).json({
        message: "Post created successfully",
        postId: result.insertedId,
        post: result,
      });
    } catch (error) {
      console.error("Failed to create post:", error);
      res.status(401).json({ error: "Invalid token" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

"use client";
import Post from "@components/Post";
import { CREATE_POST, DELETE_POST, FETCH_POST } from "@utils/endPoint";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import "../styles/postLayout.style.scss";

const PostLayout = ({ data }) => {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);

  const { data: session } = useSession();

  // useEffect(() => {
  //   // Fetch all posts
  //   fetchAllPosts().then((data) => setPosts(data));
  // }, []);

  const handleCreatePost = async (title, description, hashtag) => {
    // Create a new post
    await createPost(title, description, hashtag, userId);
    // Fetch all posts again to update the list
    fetchAllPosts().then((data) => setPosts(data));
  };

  const handleFetchPostsByUserId = async () => {
    // Fetch posts by user ID
    const userPosts = await fetchPostsByUserId(userId);
    setPosts(userPosts);
  };

  const handleDeletePost = async (postId) => {
    // Delete post if the user is the creator or an admin
    const success = await deletePost(postId, userId);
    if (success) {
      // Fetch all posts again to update the list
      fetchAllPosts().then((data) => setPosts(data));
    } else {
      // Handle deletion error
    }
  };

  const handleUpdatePost = async (postId, newData) => {
    // Update post if the user is the creator or an admin
    const success = await updatePost(postId, newData, userId);
    if (success) {
      // Fetch all posts again to update the list
      fetchAllPosts().then((data) => setPosts(data));
    } else {
      // Handle update error
    }
  };

  const createPost = async () => {
    try {
      const response = await fetch(CREATE_POST, {
        method: "POST",
        body: JSON.stringify({
          title: "dasfafsdsaf",
          description: "this is description",
          hashtag: "this is hashtag",
          userId: session.user._id,
          role: session.user.role,
          image: "",
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`, // Include the token in the Authorization header
        },
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const deletePost = async () => {
    try {
      const token = sessionStorage.getItem("USER_TOKEN");
      const response = await fetch(
        `${DELETE_POST}?postId=649ab630da4bcc504b56d696`,
        {
          method: "DELETE",
          body: JSON.stringify({
            postId: "649ab631da4bcc504b56d698",
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPost = async () => {
    if (session?.user) {
      try {
        const response = await fetch(
          `${FETCH_POST}?userId=${session?.user._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );
        const data = await response.json();
        setPosts(data.data);
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <div className="container postLayout">
      <div className="flex flex-wrap post ">
        {posts.length > 0 ? (
          posts.map((item) => {
            return <Post data={item}></Post>;
          })
        ) : (
          <div>No Post aviliable</div>
        )}
      </div>
    </div>
  );
};

export default PostLayout;

export async function getServerSideProps() {
  const { data: session } = useSession();

  // Fetch data from an API or any other data source
  if (session?.user) {
    const response = await fetch(`${FETCH_POST}?userId=${session?.user._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });
    const data = await response.json();

    // Return the data as props
    return {
      props: {
        data,
      },
    };
  } else {
    return {
      props: {
        data: [],
      },
    };
  }
}

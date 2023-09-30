"use client";
import Post from "@components/Post";
import {
  CREATE_POST,
  DELETE_POST,
  FETCH_POST,
  UPDATE_POST,
} from "@utils/endPoint";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import "../styles/postLayout.style.scss";
import PostForm from "@components/Model/PostForm";
import Button from "@components/button/Button";
import Link from "next/link";

const PostLayout = () => {
  const [posts, setPosts] = useState([]);
  const [activePost, setActivePost] = useState({});
  const [mode, setMode] = useState("view");
  const [open, setOpen] = useState(false);

  const session = useSession();
  const userData = session?.data;

  const renderPostSection = (session, handleUpdate) => {
    if (session?.user) {
      return (
        <div className="routeBtnContainer">
          <Button
            btnEvent={() => handleUpdate({}, "add")}
            btnName="Create Post"
          />
        </div>
      );
    } else {
      return (
        <>
          <h2>Please Sign in </h2>
          <Link href="/Signup" legacyBehavior>
            <a>Signup</a>
          </Link>
        </>
      );
    }
  };

  function arrayToString(arr) {
    return arr?.length > 0 ? arr.join(" ") : "";
  }

  function stringToArray(str) {
    return str.split(" ");
  }

  const dataHandler = (data) => {
    return (
      data.length > 0 &&
      data.map((item) => ({ ...item, hashtags: stringToArray(item.hashtag) }))
    );
  };
  const handleUpdatePost = async (newData) => {
    const { _id, title, description, hashtags, userId, role, image } = newData;
    const updatedHashtag = arrayToString(hashtags);
    const updatedData = {
      _id,
      title,
      description,
      hashtag: updatedHashtag,
      userId,
      role,
      image,
    };
    try {
      const response = await fetch(UPDATE_POST, {
        method: "PATCH",
        body: JSON.stringify({
          postId: newData._id,
          newData: updatedData,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.user.accessToken}`, // Include the token in the Authorization header
        },
      });
      const data = await response.json();
      setOpen(false);
      fetchPost();
    } catch (error) {
      console.log(error);
    }
  };

  const createPost = async (dataValues) => {
    try {
      const response = await fetch(CREATE_POST, {
        method: "POST",
        body: JSON.stringify({
          title: dataValues.title,
          description: dataValues.description,
          hashtag: arrayToString(dataValues.hashtags),
          userId: userData.user._id,
          role: userData.user.role,
          image: dataValues.image,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.user.accessToken}`, // Include the token in the Authorization header
        },
      });

      const data = await response.json();
      fetchPost();
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeletePost = async (id) => {
    try {
      const response = await fetch(`${DELETE_POST}?postId=${id}`, {
        method: "DELETE",
        body: JSON.stringify({
          postId: id,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.user.accessToken}`,
        },
      });

      const data = await response.json();
      fetchPost();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPost = async () => {
    try {
      const response = await fetch(`${FETCH_POST}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            userData?.user?.accessToken ? userData.user.accessToken : ""
          }`,
        },
      });
      const data = await response.json();
      setPosts(dataHandler(data.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = (data, flagUpdate) => {
    setMode(flagUpdate);
    setActivePost(data);
    setOpen(true);
  };
  useEffect(() => {
    fetchPost();
  }, [userData?.user?.accessToken]);

  return (
    <>
      {renderPostSection(userData, handleUpdate)}
      <div className="container postLayout">
        <div className="flex flex-wrap post ">
          {posts.length > 0 ? (
            posts.map((item) => {
              return (
                <Post
                  data={item}
                  handleUpdate={handleUpdate}
                  handleDeletePost={handleDeletePost}
                />
              );
            })
          ) : (
            <div>No Post aviliable</div>
          )}
        </div>
        {open && (
          <PostForm
            open={open}
            setOpen={setOpen}
            data={activePost}
            mode={mode}
            onSubmit={mode == "edit" ? handleUpdatePost : createPost}
          />
        )}
      </div>
    </>
  );
};

export default PostLayout;

// export async function getServerSideProps() {
//   const { data: session } = useSession();

//   // Fetch data from an API or any other data source
//   if (session?.user) {
//     const response = await fetch(`${FETCH_POST}?userId=${session?.user._id}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${session.user.accessToken}`,
//       },
//     });
//     const data = await response.json();

//     // Return the data as props
//     return {
//       props: {
//         data,
//       },
//     };
//   } else {
//     return {
//       props: {
//         data: [],
//       },
//     };
//   }
// }

"use client";
import Post from "@components/Post";
import {
  CREATE_POST,
  DELETE_POST,
  FETCH_POST,
  UPDATE_POST,
} from "@utils/endPoint";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import "../styles/postLayout.style.scss";
import PostForm from "@components/Model/PostForm";
import Button from "@components/button/Button";

const PostLayout = () => {
  const [posts, setPosts] = useState([]);
  const [activePost, setActivePost] = useState({});
  const [mode, setMode] = useState("view");
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [Limit, setLimit] = useState(4);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const isMounted = useRef(true);
  const [fetching, setFetching] = useState(false);
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
    }
  };

  function arrayToString(arr) {
    return arr?.length > 0 ? arr.join(" ") : "";
  }

  function stringToArray(str) {
    return str.split(" ");
  }

  const dataHandler = (data) => {
    return data.length > 0
      ? data.map((item) => ({
          ...item,
          hashtags: item.hashtag.length > 0 ? stringToArray(item.hashtag) : [],
        }))
      : [];
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
      setCurrentPage(1);
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
      setCurrentPage(1);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPost = async () => {
    if (isMounted.current || !fetching) {
      try {
        setFetching(true);
        const response = await fetch(
          `${FETCH_POST}?limit=${Limit}&page=${currentPage}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${
                userData?.user?.accessToken ? userData.user.accessToken : ""
              }`,
            },
          }
        );
        const data = await response.json();
        const newPosts = dataHandler(data.data);
        if (currentPage === 1) {
          setPosts(newPosts);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        }
        setTotal(data.total);
        setFetching(false);
      } catch (error) {
        setFetching(false);
        console.log(error);
      }
    }
  };

  const handleUpdate = (data, flagUpdate) => {
    setMode(flagUpdate);
    setActivePost(data);
    setOpen(true);
  };
  useEffect(() => {
    fetchPost();
    return () => {
      isMounted.current = false;
    };
  }, [userData?.user?.accessToken, currentPage]);

  return (
    <div className="postLayout">
      {renderPostSection(userData, handleUpdate)}
      <div className="container">
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
            <div className="m-5 noData">
              <span>No posts are aviliable</span>
            </div>
          )}

          {posts.length < total && (
            <div className="loadMoreBtn">
              <Button
                isDisabled={fetching}
                btnEvent={() => {
                  setFetching(false);
                  setCurrentPage((current) => current + 1);
                  setLimit(4);
                }}
                btnName="Load More"
              />
            </div>
          )}
        </div>
        {loading && <div>Loading...</div>}

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
    </div>
  );
};

export default PostLayout;

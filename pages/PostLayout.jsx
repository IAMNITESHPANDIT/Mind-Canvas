"use client";
import {
  CREATE_POST,
  DELETE_POST,
  FETCH_POST,
  UPDATE_POST,
} from "@utils/endPoint";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import "../styles/postLayout.style.scss";
import PostSection from "@components/post/post-section";
import PostList from "@components/post/post-list";
import LoadingIndicator from "@components/loading";
import PostFormModal from "@components/post/post-form-modal";
import { arrayToString, dataHandler } from "@components/post/handler";
import { networkCall } from "@utils/network";

const PostLayout = () => {
  const [posts, setPosts] = useState([]);
  const [activePost, setActivePost] = useState({});
  const [mode, setMode] = useState("view");
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const [total, setTotal] = useState(0);
  const isMounted = useRef(true);
  const [fetching, setFetching] = useState(false);
  const session = useSession();
  const userData = session?.data;

  const handleUpdate = (data, flagUpdate) => {
    setMode(flagUpdate);
    setActivePost(data);
    setOpen(true);
  };

  const fetchPost = async () => {
    try {
      setFetching(true);
      const response = await networkCall(
        `${FETCH_POST}?limit=${limit}&page=${currentPage}`,
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
      const response = await networkCall(UPDATE_POST, {
        method: "PATCH",
        body: JSON.stringify({
          postId: newData._id,
          newData: updatedData,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.user.accessToken}`,
        },
      });
      const data = await response.json();
      if (currentPage === 1) {
        fetchPost();
      } else {
        setCurrentPage(1);
      }
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const createPost = async (dataValues) => {
    try {
      const response = await networkCall(CREATE_POST, {
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
          Authorization: `Bearer ${userData.user.accessToken}`,
        },
      });

      const data = await response.json();
      if (currentPage === 1) {
        fetchPost();
      } else {
        setCurrentPage(1);
      }
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      const response = await networkCall(`${DELETE_POST}?postId=${id}`, {
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
      if (currentPage === 1) {
        fetchPost();
      } else {
        setCurrentPage(1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPost();
    return () => {
      isMounted.current = false;
    };
  }, [userData?.user?.accessToken, currentPage]);



  return (
    <div className="postLayout">
      <PostSection session={userData} handleUpdate={handleUpdate} />
      <div className="container">
        <PostList
          posts={posts}
          handleUpdate={handleUpdate}
          handleDeletePost={handleDeletePost}
          fetching={fetching}
          total={total}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setLimit={setLimit}
        />
        <PostFormModal
          open={open}
          setOpen={setOpen}
          data={activePost}
          mode={mode}
          onSubmit={mode === "edit" ? handleUpdatePost : createPost}
        />
      </div>
      {fetching && <LoadingIndicator />}
    </div>
  );
};

export default PostLayout;

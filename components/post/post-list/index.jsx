import React, { useState, useEffect } from 'react';
import LoadMoreButton from "@components/button/load-more";
import NoDataMessage from "@components/no-data";
import Post from '../main-post/Index';

const PostList = ({ posts, handleUpdate, handleDeletePost, fetching, total, currentPage , setCurrentPage ,setLimit }) => {
  const [showNoData, setShowNoData] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNoData(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-wrap post ">
      {posts.length > 0 ? (
        posts.map((item) => (
          <Post
            key={item._id}
            data={item}
            handleUpdate={handleUpdate}
            handleDeletePost={handleDeletePost}
          />
        ))
      ) : (
        !fetching && showNoData && <NoDataMessage />
      )}

      {posts.length < total && (
        <LoadMoreButton
          fetching={fetching}
          onClick={() => {
            setCurrentPage(currentPage + 1);
            setLimit(4);
          }}
        />
      )}
    </div>
  );
};

export default PostList;

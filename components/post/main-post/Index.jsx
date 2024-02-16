import React from "react";
import { FiEdit3 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import Head from 'next/head';
import { ConfirmDelete } from "@utils/ConfirmAlerts";
import "../../../styles/post.style.scss";

function Post({ data, handleUpdate, handleDeletePost }) {
  const pageTitle = `${data.title} - MindCanvas`;
  const pageDescription = `${data.description} - Discover innovative ideas and insightful discussions on our platform. Explore a diverse range of topics, from technology and entrepreneurship to art and culture. Join the conversation and spark your creativity today. `;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Head>

      <div
        className="max-w-sm rounded overflow-hidden shadow-lg m-4 poster cursor-pointer"
        onClick={() => handleUpdate(data, "view")}
      >
        {data.isDelete && (
          <span className="editBtn">
            <FiEdit3
              onClick={(e) => {
                e.stopPropagation();
                handleUpdate(data, "edit");
              }}
              title="Edit"
            />
            <AiOutlineDelete
              onClick={(e) => {
                e.stopPropagation();
                ConfirmDelete(data._id, handleDeletePost);
              }}
              title="Delete"
            />
          </span>
        )}

        <img
          className="w-full h-auto posterImg"
          src={data.image}
          alt="Sunset in the mountains"
        />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{data.title}</div>
          <p className="text-gray-700 text-base">{data.description}</p>
        </div>
        <div className="p-3">
          {data?.hashtags.length > 0 &&
            data?.hashtags.map((item) => {
              return (
                <span
                  key={item}
                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                  #{item}
                </span>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default Post;

import Button from "@components/button/Button";
import Link from "next/link";
export const renderPostSection = (session, handleUpdate) => {
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

export function arrayToString(arr) {
  return arr?.length > 0 ? arr.join(" ") : "";
}

export function stringToArray(str) {
  return str.split(" ");
}

export const dataHandler = (data) => {
  return (
    data.length > 0 &&
    data.map((item) => ({ ...item, hashtags: stringToArray(item.hashtag) }))
  );
};

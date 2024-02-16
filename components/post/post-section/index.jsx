import Button from "@components/button/Button";

const PostSection = ({ session, handleUpdate }) => {
    return (
      <div className="routeBtnContainer">
        {session?.user && (
          <Button btnEvent={() => handleUpdate({}, "add")} btnName="Create Post" />
        )}
      </div>
    );
  };

export default PostSection;
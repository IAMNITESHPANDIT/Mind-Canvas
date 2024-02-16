import PostForm from "@components/model/PostForm";

const PostFormModal = ({ open, setOpen, data, mode, onSubmit }) => {
    return (
      <PostForm open={open} setOpen={setOpen} data={data} mode={mode} onSubmit={onSubmit} />
    );
  };
export default PostFormModal;
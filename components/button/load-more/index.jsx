import Button from "../Button";

const LoadMoreButton = ({ fetching, onClick }) => {
    return (
      <div className="loadMoreBtn">
        <Button isDisabled={fetching} btnEvent={onClick} btnName="Load More" />
      </div>
    );
  };
export default  LoadMoreButton;
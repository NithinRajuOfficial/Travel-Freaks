import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Typography,
} from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api";
import { showError, showSuccess } from "../../../assets/tostify";

export function CommentCard() {
  const postData = useSelector((state) => state.post.data);
  const user = useSelector((state) => state.user.user);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [currPage, setCurrPage] = useState(0);
  const [clickedShowMore, setClickedShowMore] = useState(false);
  const [totalNoOfComments, setTotalNoOfComments] = useState(0);
  const [reload, setReload] = useState(false);
  const navigate = useNavigate();
  const addComment = async () => {
    
    if (!user) {
      return showError("Please Login");
    }
    if (newComment.trim() !== "") {
      try {
        const response = await api.post("user/addComment", {
          userId: user._id,
          postId: postData._id,
          comment: newComment,
        });
        if (response === "login") {
          return showError("Please Login");
        }
        setComments([...comments, response?.data]);
        setNewComment("");
        setReload(true);
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };
  const handleShowMore = () => {
    setCurrPage(currPage + 1);
    setClickedShowMore(!clickedShowMore);
  };

  useEffect(() => {
    const fetchInitialComments = async () => {
      try {
        if (!user.isAuthenticated) {
          return false;
        }
        const response = await api.get(`user/getComments/${postData._id}`, {
          params: { skip: currPage * 3, limit: 3 },
        });
        const allComments = response?.data?.allComments;
        setTotalNoOfComments(response?.data?.totalNoOfComments);
        setReload(false);

        setComments(allComments);
        setNewComment("");
      } catch (error) {
        console.error("Error fetching initial comments:", error);
      }
    };

    if (postData) {
      fetchInitialComments();
    }
  }, [postData, clickedShowMore, reload]);
  // to get the commented users profile
  const commentedUserProfile = (userId) => {
    try {
      navigate(`/profile/${userId}`);
    } catch (error) {
      console.error("Unable to get the user details:", error);
    }
  };

  // function to delete a comment
  const handleCommentDelete = async (commentId) => {
    try {
      const response = await api.delete(`user/deleteComment/${commentId}`);
      if (response.status === 200) {
        showSuccess(response.data.message);
        setComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== commentId)
        );
      } else {
        showError("Something went wrong, please try again");
      }
    } catch (error) {
      console.error(
        "Something went wrong, unable to delete the comment:",
        error
      );
    }
  };

  return (
    <div className="h-full w-full sm:w-96 sm:mt-14 px-6 sm:p-0">
      <img
        className="rounded-lg object-cover object-center"
        src={postData?.image}
        alt="nature image"
      />
      <Card className="mt-6 w-full sm:w-96">
        <List>
          {comments?.map((comment) => (
            <ListItem key={comment._id} className="hover:cursor-auto">
              <ListItemPrefix>
                <Avatar
                  variant="circular"
                  alt={comment?.userId?.name}
                  src={comment?.userId?.profileImage}
                />
              </ListItemPrefix>
              <div>
                <div className="flex flex-row">
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className="w-5 hover:cursor-pointer mr-3"
                    onClick={() => commentedUserProfile(comment?.userId?._id)}
                  >
                    {comment?.userId?.name}
                  </Typography>
                  {comment.userId?._id === user?._id ? (
                    <span className="ml-5 mt-1 hover:cursor-pointer">
                      <svg
                        viewBox="0 0 1024 1024"
                        fill="red"
                        height="1em"
                        width="1em"
                        onClick={() => handleCommentDelete(comment._id)}
                      >
                        <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z" />
                      </svg>
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <Typography
                  variant="small"
                  color="gray"
                  className="font-normal mt-1"
                >
                  {comment?.commentText}
                </Typography>
                <Typography
                  variant="small"
                  color="gray"
                  className="mt-1 text-xs"
                >
                  <span className=" mr-4">
                    {" "}
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>

                  {new Date(comment.createdAt).toLocaleTimeString()}
                </Typography>
              </div>
            </ListItem>
          ))}
        </List>
        {!(currPage * 3 > totalNoOfComments - 3) && (
          <div className="text-center mt-2">
            <Button
              size="sm"
              color="blue"
              onClick={handleShowMore}
              className="text-xs"
            >
              Show More
            </Button>
          </div>
        )}
        <CardBody>
          <div className="mb-4 flex justify-center">
            <Input
              type="text"
              placeholder="Write a comment..."
              className="w-full"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              size="sm"
              color="blue"
              className="flex items-center gap-2 ml-3"
              onClick={addComment}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

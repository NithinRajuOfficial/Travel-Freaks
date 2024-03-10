/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { api } from "../../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { usePostFetching } from "../../../api/postsCustomHook";
import {
  fetchPostStart,
  fetchPostSuccess,
  fetchPostFailure,
} from "../../../redux/postSlice";
import SkeletonLoading from "./PostsSkeleton";

export function HomePosts({ location, otherUserId }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { posts, loading, updatedCount, setUpdatedCount } = usePostFetching();
  const [visiblePosts, setVisiblePosts] = useState(3);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [likeStatus, setLikeStatus] = useState({});
  const userData = useSelector((state) => state.user.user);
  const filteredPosts =
    location === "home"
      ? posts.filter((post) => post.userId !== userData?._id)
      : otherUserId
      ? posts.filter((post) => post.userId === otherUserId)
      : posts.filter((post) => post.userId === userData?._id);

  useEffect(() => {
    const handleScroll = () => {
      if (
        !fetchingMore &&
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        filteredPosts.length > visiblePosts // Check if there are more posts to fetch
      ) {
        setFetchingMore(true);
        setTimeout(() => {
          setVisiblePosts((prevVisible) => prevVisible + 3);
          setFetchingMore(false);
        }, 1000);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchingMore, filteredPosts, visiblePosts]);

  const fetchingPostDetails = async (postId) => {
    try {
      dispatch(fetchPostStart());

      const response = await api.get(`user/postDetails?postId=${postId}`);
      const postData = response.data.postDetails;
      dispatch(fetchPostSuccess(postData));

      navigate("/postDetails");
    } catch (error) {
      dispatch(fetchPostFailure(error));
      console.error("Fetching post details error:", error);
    }
  };

  useEffect(() => {
    const initialLikeStatus = {};
    posts.forEach((post) => {
      initialLikeStatus[post._id] = post.likes.includes(userData?._id);
    });
    setLikeStatus(initialLikeStatus);
  }, [posts]);

  const handleLikeAndUnlike = async (postId) => {
    try {
      const response = await api.post(`user/likeOrUnlike/${postId}`);
      const currentLikeStatus = response.data.currentLikeStatus;
      setUpdatedCount(!updatedCount);

      setLikeStatus((prevLikeStatus) => ({
        ...prevLikeStatus,
        [postId]: currentLikeStatus,
      }));
    } catch (error) {
      console.error("Post Like or Unlike error:", error);
    }
  };

  // by this we can show user post in his profile and non user posts in his home page

  // array for creating the number of skeletons for the posts
  // const skeletonArray = Array(visiblePosts)
  //   .fill()
  //   .map((_, index) => <SkeletonLoading key={index} />);
  return (
    <>
      <div className="m-auto mt-40 flex flex-row flex-wrap justify-center">
        {loading ? (
          <div className="flex flex-row m-24">
            {Array(3)
              .fill()
              .map((_, index) => (
                <SkeletonLoading key={index} />
              ))}
          </div>
        ) : Array.isArray(filteredPosts) && filteredPosts.length > 0 ? (
          filteredPosts.slice(0, visiblePosts).map((post) => (
            <Card
              key={post.id}
              className={`h-full w-full max-w-[26rem] shadow-lg mb-10 mr-5`}
            >
              <CardHeader floated={false} color="blue-gray">
                <img
                  className="h-60 w-96 object-cover"
                  src={post.image}
                  alt="post image"
                />
                <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60 " />
                <IconButton
                  size="sm"
                  color={likeStatus[post._id] ? "red" : "white"}
                  variant="text"
                  className="!absolute top-4 right-4 rounded-full duration-1000"
                  onClick={() => handleLikeAndUnlike(post._id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-9 w-10"
                  >
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    <text
                      x="50%"
                      y="50%"
                      text-anchor="middle"
                      dy=".3em"
                      font-size="10"
                      fill={likeStatus[post._id] ? "white" : "black"}
                    >
                      {post.likes.length == 0 ? "" : post.likes.length}
                    </text>
                  </svg>
                </IconButton>
              </CardHeader>
              <CardBody>
                <div className="mb-3 flex items-center justify-between">
                  <Typography
                    variant="h5"
                    color="blue-gray"
                    className="font-medium"
                  >
                    {post.title}
                  </Typography>
                </div>
              </CardBody>
              <CardFooter className="pt-3">
                <Button
                  size="lg"
                  fullWidth={true}
                  onClick={() => {
                    fetchingPostDetails(post._id);
                  }}
                >
                  Read More...
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div>No posts available</div>
        )}
        {fetchingMore && (
          <div className="flex flex-row m-24">
            {Array(3)
              .fill()
              .map((_, index) => (
                <SkeletonLoading key={index} />
              ))}
          </div>
        )}
      </div>
      <div className="text-center mt-5 mb-10 font-semibold text-2xl text-blue-gray-600">
        {!loading && filteredPosts.length <= visiblePosts && !fetchingMore && (
          <div>No more posts available</div>
        )}
      </div>
    </>
  );
}

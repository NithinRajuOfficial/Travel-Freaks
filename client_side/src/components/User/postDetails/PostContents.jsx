import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Card,
  CardBody,
  Typography,
  List,
  Chip,
  Button,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { api } from "../../../api/api";
import { showSuccess, showError } from "../../../assets/tostify";
import { defaultProImg } from "../../../assets/constants";
import { PostCreationForm } from "../AddPost";

export function PostContentCard() {
  // Assuming you have a selector for post and user data
  const postData = useSelector((state) => state.post.data);
  const userData = useSelector((state) => state.user.user);
  const [open, setOpen] = useState(1);
  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  // creating a state variable to tract edit mode
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Check if postData is null or undefined, and return null if it is
  if (!postData) {
    return <div>loading...........</div>;
  }

  // Function to format date in "MM/DD/YYYY" format
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  // checking is the user is authorized to edit the post
  const isUserAuthorizedToEdit = postData?.userId?._id === userData?._id;

  // to see the profile of the post creator
  const postCreatorProfile = (userId) => {
    try {
      navigate(`/profile/${userId}`);
    } catch (error) {
      console.error("Unable to get user details:", error);
    }
  };

  // function to delete the post
  const handleDeletePost = async (postId) => {
    try {
      const response = await api.delete(`user/deletePost/${postId}`);
      if (response.status === 200) {
        showSuccess(response.data.message);
      } else {
        showError("Unable to delete the Post, please retry.");
      }
      navigate("/profile");
    } catch (error) {
      console.error("Something went wrong while deleting post:", error);
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-lg mt-6">
      <CardBody>
        {isEditing ? (
          <PostCreationForm
            postData={postData}
            isEdit={isEditing}
            onSuccess={() => {
              setIsEditing(false);
            }}
          />
        ) : (
          <div>
            {postData?.userId?._id !== userData?._id ? (
              <div className="flex justify-end items-center gap-1 mb-2">
                <Avatar
                  className="w-8 h-8"
                  src={postData?.userId?.profileImage || defaultProImg}
                  alt="avatar"
                />
                <div>
                  <Typography
                    className="text-sm sm:text-base font-semibold hover:cursor-pointer"
                    onClick={() => postCreatorProfile(postData?.userId?._id)}
                  >
                    {postData?.userId?.name}
                  </Typography>
                </div>
              </div>
            ) : (
              <div></div>
            )}
            <Typography variant="h5" color="blue-gray" className="mb-4">
              {postData?.title}
            </Typography>
            <Typography className="text-gray-700 mb-4">
              {postData?.description}
            </Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex  justify-start gap-10 sm:gap-4">
                <Typography>
                  <Chip
                    variant="ghost"
                    size="sm"
                    value="Location"
                    className="flex justify-center"
                  />
                </Typography>
                <Typography>{postData?.location}</Typography>
              </div>
              <div className="flex justify-start gap-7 sm:gap-4">
                <Typography className="text-gray-600">
                  <Chip
                    variant="ghost"
                    size="sm"
                    value="Start Date"
                    className="flex justify-center"
                  />
                </Typography>
                <Typography>{formatDate(postData?.startDate)}</Typography>
              </div>
              <div className="flex justify-start gap-11 sm:gap-4">
                <Typography className="text-gray-600">
                  <Chip
                    variant="ghost"
                    size="sm"
                    value="End Date"
                    className="flex justify-center"
                  />
                </Typography>
                <Typography>{formatDate(postData?.endDate)}</Typography>
              </div>
              <div className="flex justify-start gap-14 sm:gap-4">
                <Typography className="text-gray-600">
                  <Chip
                    variant="ghost"
                    size="sm"
                    value="Budget"
                    className=" flex justify-center"
                  />
                </Typography>
                <Typography>
                  {postData?.currency}
                  {postData?.amount}
                </Typography>
              </div>
            </div>
            <Typography className="mt-6 text-gray-600">
              <strong>Events & Timings</strong>
            </Typography>
            <List className="mt-2">
              {postData && postData?.itinerary ? (
                postData?.itinerary.map((item, i) => (
                  <Accordion key={item._id} open={open === i + 1}>
                    <AccordionHeader
                      onClick={() => handleOpen(i + 1)}
                      className="text-sm"
                    >{`Day ${item.day}`}</AccordionHeader>
                    <AccordionBody className="text-base">
                      {item.activities[0].description} from{" "}
                      {item.activities[0].startTime} to{" "}
                      {item.activities[0].endTime}
                    </AccordionBody>
                  </Accordion>
                ))
              ) : (
                <p>No itinerary data available</p>
              )}
            </List>

            <div className="flex justify-start items-center gap-4 mt-1">
              <Typography className="text-gray-600">
                <Chip
                  variant="ghost"
                  size="sm"
                  value="Max Number of People"
                  className="px-2 py-1  flex justify-center"
                />
              </Typography>
              <Typography>{postData?.maxNoOfPeoples}</Typography>
            </div>
          </div>
        )}
        {isUserAuthorizedToEdit && (
          <div className="flex justify-end">
            {isEditing ? (
              <div>
                <Button
                  className="mr-2"
                  onClick={() => handleDeletePost(postData?._id)}
                >
                  Delete
                </Button>
                <Button
                  className="bg-red-600"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                className="bg-blue-600"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

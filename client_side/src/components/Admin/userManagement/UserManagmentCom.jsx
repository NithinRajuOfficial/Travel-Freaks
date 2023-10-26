import {
  Avatar,
  Card,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { blockedUser, unblockUser } from "../../../redux/adminSlice";
import { defaultProImg } from "../../../assets/constants";
import { api } from "../../../api/api";

export function UserDetailsComponent() {
  const [totalUsers, setTotalUsers] = useState([]);
  const userStatus = useSelector((state) => state.admin.blockedUsers);
  const dispatch = useDispatch();
    console.log(userStatus,"[]]]]]");
  useEffect(() => {
    const fetchAllUsersData = async () => {
      const response = await api.get("/admin/getAllUsersData");
      setTotalUsers(
        response.data.allUsersData.map((user) => ({
          ...user,
          createdAt: new Date(user.createdAt).toLocaleDateString(),
        }))
      );
      const statusObj = {};
      totalUsers.map((user) => {
        statusObj[user._id] = user.blockStatus;
      });
    };
    fetchAllUsersData();
  }, []);

  //   user block and unblock functionality
  const userBlockOrUnblock = async (userId) => {
    try {
      const response = await api.put(`/admin/userBlockOrUnblock/${userId}`);
      console.log(response, "ppp");
      if (response.data.status == true) {
        dispatch(blockedUser(userId)); // Dispatch the action to block the user
      } else {
        dispatch(unblockUser(userId)); // Dispatch the action to unblock the user
      }
    } catch (error) {
      console.error("Unable to block or unblock the user:", error);
    }
  };
  return (
    <>
      {totalUsers.map((user) => (
        <Card key={user._id} className="mb-10">
          <CardBody>
            <div className="flex justify-between px-2">
              <Avatar
                src={user.profileImage ? user.profileImage : defaultProImg}
                alt="avatar"
              />
              <Typography>{user.name}</Typography>
              <Typography>{user.email}</Typography>
              <Typography>{user.createdAt}</Typography>
              <Button
                variant="sm"
                onClick={() => userBlockOrUnblock(user._id)}
                className={
                  Array.isArray(userStatus) && userStatus.includes(user._id)
                    ? "bg-blue-900"
                    : "bg-red-900"
                }
              >
                {Array.isArray(userStatus) && userStatus.includes(user._id)
                  ? "Unblock"
                  : "Block"}
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </>
  );
}

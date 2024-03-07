/* eslint-disable react/prop-types */
import {
    Avatar,
    Card,
    List,
    ListItem,
    ListItemPrefix,
    Typography,
  } from "@material-tailwind/react";
  import { Link } from "react-router-dom";
  import { defaultProImg } from "../../../assets/constants";
  import { api } from "../../../api/api";
  
  const handleChat = async(userId) => {
    try {
      const response = await api.get(`/user/accessChats/${userId}`)
      console.log(response,"ppp")
    } catch (error) {
      console.error("Failed to fetch chats ERROR:",error)
    }
  }
  
  export default function UserCard({user}) {
    return (
      <Card
        key={user._id}
        className=" w-96 md:w-3/4 h-20 mt-5 shadow-2xl hover:shadow-3xl transition duration-300 ease-in-out transform hover:-translate-y-1 "
      >
        <List>
          <ListItem className="cursor-default">
            <ListItemPrefix>
              <Avatar
                variant="circular"
                alt={user._id}
                src={user.profileImage || defaultProImg}
              />
            </ListItemPrefix>
            <div className="flex justify-start w-48">
              <Link>
                <Typography
                  variant="h6"
                  color="blue-gray"
                  onClick={()=>handleChat(user._id)}
                >
                  {user.name}
                </Typography>
              </Link>
            </div>
          </ListItem>
        </List>
      </Card>
    );
  }
  
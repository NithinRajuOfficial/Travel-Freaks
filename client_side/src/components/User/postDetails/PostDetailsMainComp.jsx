import { useEffect } from "react";
import { NavbarDefault } from "../UserNavbar";
import { CommentCard } from "../postDetails/CommentCom";
import { PostContentCard } from "../postDetails/PostContents";
import { useDispatch } from "react-redux";
import { clearPostData } from "../../../redux/postSlice";


export function PostDetails() {
  const dispatch = useDispatch()

  useEffect(() => {
    return () => {
      dispatch(clearPostData());
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <NavbarDefault />

      <div className="flex flex-1">
        <div className="w-1/4 p-4 mr-24">
          <CommentCard />
        </div>

        <div className="w-3/4 p-4 mr-10 mt-4">
          <PostContentCard />
        </div>
      </div>
    </div>
  );
}

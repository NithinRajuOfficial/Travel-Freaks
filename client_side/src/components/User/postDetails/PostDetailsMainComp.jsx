import { NavbarDefault } from "../UserNavbar";
import { CommentCard } from "../postDetails/CommentCom";
import { PostContentCard } from "../postDetails/PostContents";

export function PostDetails() {
  return (
    <div className="flex flex-col h-screen">
      <NavbarDefault />

      <div className="flex flex-col flex-1 md:flex md:flex-row md:flex-1 ">
        <div className="w-1/4 p-4 mr-24">
          <CommentCard />
        </div>

        <div className="w-4/4 p-4 md:w-3/4 md:mr-10 mt-4 mb-5">
          <PostContentCard />
        </div>
      </div>
    </div>
  );
}

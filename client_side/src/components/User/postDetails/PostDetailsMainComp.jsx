import { NavbarDefault } from "../UserNavbar";
import { CommentCard } from "../postDetails/CommentCom";
import { PostContentCard } from "../postDetails/PostContents";

export function PostDetails() {
  return (
    <div className="flex flex-col h-screen">
      <NavbarDefault />

      <div className="flex flex-col md:flex md:flex-row sm:justify-between gap-10 sm:px-20">
        <div className="p-4 mt-3 flex-1">
          <PostContentCard />
        </div>

        <div>
          <CommentCard />
        </div>
      </div>
    </div>
  );
}

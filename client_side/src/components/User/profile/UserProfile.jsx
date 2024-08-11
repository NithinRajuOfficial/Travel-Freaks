import { useParams } from "react-router-dom";
import { NavbarDefault } from "../UserNavbar";
import { CoverProfileImageDetails } from "./CoverImgProImg";
// import {FollowersList} from './Followers'
import {HomePosts} from '../home/HomePosts'

export function Profile() {
  const {userId} = useParams()
  return (
    <>
      <NavbarDefault />
      <CoverProfileImageDetails userId={userId}/>
      <div className="relative sm:top-24 top-96">
      <HomePosts location={"profile"} otherUserId={userId} />
      </div>
    </>
  );
}

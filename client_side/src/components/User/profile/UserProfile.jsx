import { NavbarDefault } from "../UserNavbar";
import { CoverProfileImageDetails } from "./CoverImgProImg";
import {FollowersList} from './Followers'
import {HomePosts} from '../home/HomePosts'

export function Profile() {
  return (
    <>
      <NavbarDefault />
      <CoverProfileImageDetails />
      <FollowersList />
      <HomePosts />
    </>
  );
}

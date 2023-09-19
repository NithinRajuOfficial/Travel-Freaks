import { NavbarDefault } from "../UserNavbar";
import { HomeCarousel } from "./HomeCarousel";
import { HomeContent } from "./HomeContent";
import { HomeSubCard } from "./HomeSubCard";
import { HomePosts } from "./HomePosts";

export function Home() {
  return (
    <>
      <NavbarDefault />
      <HomeCarousel />
      <HomeContent />
      <HomeSubCard />
      <HomePosts />
    </>
  );
}

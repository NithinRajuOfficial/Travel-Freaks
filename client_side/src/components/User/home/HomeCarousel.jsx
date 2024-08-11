import { Carousel, Typography } from "@material-tailwind/react";
import { carouselData } from "../../../assets/constants";
 
export function HomeCarousel() {
  return (
    <Carousel className="rounded-xl -z-0">
      {carouselData.map((elm,i)=>(
        <div key={i} className="relative h-96 w-full">
        <img
          src={elm.img}
          alt="image 1"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 grid h-full w-full place-items-center bg-black/50">
          <div className="w-3/4 text-center md:w-2/4">
            <Typography
              variant="h1"
              color="white"
              className="mb-4 text-3xl md:text-4xl lg:text-6xl opacity-70 font-black"
            >
              {elm.title}
            </Typography>
            <Typography
              variant="lead"
              color="white"
              className="mb-12 opacity-60"
            >
              {elm.description}
            </Typography>
          </div>
        </div>
      </div>
      ))}
    </Carousel>
  );
}
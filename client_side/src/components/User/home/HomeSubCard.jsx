import { CardHeader, Typography } from "@material-tailwind/react";

export function HomeSubCard() {
  return (
    <>
      <div className="hidden xl:block">
        <div className="md:h-full md:p-4  md:mt-16 ">
          <div className="flex items-center justify-between h-60">
            {/* Left CardHeader */}
            <div className="w-96 h-100">
              <CardHeader
                floated={false}
                shadow={false}
                color="transparent"
                className="relative overflow-visible w-96 m-0"
              >
                <img
                  src="https://www.pandotrip.com/wp-content/uploads/2015/07/Hamilton-Pool-by-Jaco-Botha-740x416.jpeg"
                  alt="ui/ux review check"
                  className="relative top-10 w-96 h-full rounded-xl object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1501908734255-16579c18c25f?auto=format&fit=crop&q=80&w=1856&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="ui/ux review check"
                  className="relative bottom-20 left-24 w-96 h-52 rounded-2xl object-cover border-white border-8"
                />
              </CardHeader>
            </div>
            {/* Middle Text */}
            <div className="w-96 h-100 flex items-center justify-center">
              <div>
                <Typography className="text-2xl font-bold text-center mb-4">
                  Unearth Hidden Gems
                </Typography>
                <Typography className="text-sm text-gray-600">
                  Embark on a journey to uncover the world&apos;s best-kept
                  secrets. Share your stories, inspire wanderlust, and celebrate
                  the extraordinary.
                </Typography>
              </div>
            </div>
            {/* Right CardHeader */}
            <div className="w-96 h-100">
              <CardHeader
                floated={false}
                shadow={false}
                color="transparent"
                className="relative overflow-visible w-96 m-0"
              >
                <img
                  src="https://images.unsplash.com/photo-1514608070127-fa6001fd36ce?auto=format&fit=crop&q=80&w=1932&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="ui/ux review check"
                  className="relative top-10 w-96 h-full rounded-xl object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1530127857930-4c7389cdca70?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="ui/ux review check"
                  className="relative bottom-20 right-24 w-96 h-52 rounded-2xl object-cover border-white border-8"
                />
              </CardHeader>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

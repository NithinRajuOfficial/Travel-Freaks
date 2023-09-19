import { CardHeader, CardBody, Typography } from "@material-tailwind/react";

export function HomeSubCard() {
  return (
    <>
      <div className="h-full p-4 mb-40">
        <div className="flex items-center justify-center flex-wrap gap-2 h-60">
          <div className="w-100 mr-20 h-100">
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
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                alt="ui/ux review check"
                className="relative bottom-20 left-24 w-96 h-52 rounded-2xl object-cover border-white border-8"
              />
            </CardHeader>
          </div>
          <CardBody className="flex flex-col justify-center -mt-20" >
            <Typography variant="h4" color="blue-gray">
              UI/UX Review Check
            </Typography>
            <Typography
              variant="lead"
              color="gray"
              className="mt-3 font-normal flex flex-wrap"
            >
              Because it&apos;s about motivating the doers. Because I&apos;m
              here to follow my dreams and inspire others.
            </Typography>
          </CardBody>
        </div>
      </div>
    </>
  );
}

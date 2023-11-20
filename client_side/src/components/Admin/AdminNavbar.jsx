import {
    Navbar,
    // Avatar,
    Button,
    Input,
  } from "@material-tailwind/react";
//   import { BellIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
   
  export function AdminNavbar() {
    return (
      <Navbar className="mx-auto max-w-screen-xl p-4 h-20">
        <div className="flex flex-wrap items-center justify-between gap-y-4 text-blue-gray-900">
        <div className="relative flex w-full gap-2 md:w-max">
            <Input
              type="search"
              label="Type here..."
              className="pr-20"
              containerProps={{
                className: "min-w-[288px]",
              }}
            />
            <Button size="sm" className="!absolute right-1 top-1 rounded">
              Search
            </Button>
          </div>
          <div className="flex items-center gap-4">
        {/* <Avatar src="/img/face-2.jpg" alt="avatar" variant="rounded" /> */}
      </div>
          {/* <div className="ml-auto flex gap-1 md:mr-4">
            <IconButton variant="text" color="blue-gray">
              <Cog6ToothIcon className="h-4 w-4" />
            </IconButton>
            <IconButton variant="text" color="blue-gray">
              <BellIcon className="h-4 w-4" />
            </IconButton>
          </div> */}
        </div>
      </Navbar>
    );
  }
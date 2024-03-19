const defaultProImg =
  "https://img.freepik.com/free-icon/user_318-875902.jpg?w=2000";

const defaultCoverImg =
  "https://t4.ftcdn.net/jpg/04/81/13/43/360_F_481134373_0W4kg2yKeBRHNEklk4F9UXtGHdub3tYk.jpg";

const defaultMainCoverImg =
  "https://images.unsplash.com/photo-1482398650355-d4c6462afa0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";

const carouselData = [
  {
    img: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80",
    title: "Escape to Paradise",
    description:
      "Indulge in the serenity of turquoise waters and golden sands. Dive into an oasis of relaxation and rejuvenation.",
  },
  {
    img: "https://plus.unsplash.com/premium_photo-1669863283269-7f1841a60648?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Conquer the Heights",
    description:
      "Embark on a journey to conquer towering peaks and witness nature's grandeur unfold before your eyes. Every step is a triumph, every vista a masterpiece.",
  },
  {
    img: "https://images.unsplash.com/photo-1433888104365-77d8043c9615?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Discover the Soul of a City",
    description:
      "Immerse yourself in the vibrant tapestry of cultures, traditions, and flavors. Let the rhythm of life in the streets captivate your senses.",
  },
  {
    img: "https://images.unsplash.com/photo-1456926631375-92c8ce872def?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Encounters in the Wild",
    description:
      "Embark on a thrilling safari through untamed wilderness, where every turn reveals a new marvel. Witness the raw beauty of nature in its purest form.",
  },
  {
    img: "https://plus.unsplash.com/premium_photo-1697730288821-62c119fb7c5d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Journey Through Time",
    description:
      "Step back in time and trace the footsteps of kings and emperors. Explore the legacy of bygone eras and unravel the mysteries of history.",
  },
  {
    img: "https://images.unsplash.com/photo-1502726299822-6f583f972e02?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Escape to Tranquility",
    description:
      "Find solace in the embrace of nature's quietude. Lose yourself in the melody of rustling leaves and gentle ripples, as time stands still in serene landscapes.",
  },
];
const loginInputData = [
  { color: "white", type: "text", name: "email", label: "Email" },
  { color: "white", type: "password", name: "password", label: "Password" },
];

const signupInputData = [
  { color: "white", type: "text", name: "name", label: "Name" },
  { color: "white", type: "text", name: "email", label: "Email" },
  { color: "white", type: "password", name: "password", label: "Password" },
];

const postInputData = [
  {
    type: "text",
    name: "title",
    label: "Title",
  },

  {
    type: "date",
    name: "startDate",
    label: "Start Date",
  },

  {
    type: "date",
    name: "endDate",
    label: "End Date",
  },

  {
    type: "text",
    name: "location",
    label: "Location",
  },

  {
    type: "text",
    name: "currency",
    label: "Currency",
  },

  {
    type: "number",
    name: "amount",
    label: "Budget Amount",
  },

  {
    type: "number",
    name: "maxNoOfPeoples",
    label: "Max Number of peoples",
  },

  {
    type: "text",
    name: "description",
    label: "Description",
  },
];

export {
  defaultProImg,
  defaultCoverImg,
  defaultMainCoverImg,
  carouselData,
  loginInputData,
  signupInputData,
  postInputData,
};

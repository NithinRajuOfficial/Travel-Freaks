const defaultProImg =
  "https://img.freepik.com/free-icon/user_318-875902.jpg?w=2000";

const defaultCoverImg =
  "https://t4.ftcdn.net/jpg/04/81/13/43/360_F_481134373_0W4kg2yKeBRHNEklk4F9UXtGHdub3tYk.jpg";

const defaultMainCoverImg =
  "https://images.unsplash.com/photo-1482398650355-d4c6462afa0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";

const postInputData = [
  {
    title: [
      {
        type: "text",
        name: "title",
        label: "Title",
      },
    ],
    startDate: [
      {
        type: "date",
        name: "startDate",
        label: "Start Date",
      },
    ],
    endDate: [
      {
        type: "date",
        name: "endDate",
        label: "End Date",
      },
    ],
    location: [
      {
        type: "text",
        name: "location",
        label: "Location",
      },
    ],
    currency: [
      {
        type: "text",
        name: "currency",
        label: "Currency",
      },
    ],
    amount: [
      {
        type: "number",
        name: "amount",
        label: "Budget Amount",
      },
    ],
    maxNumberOfPeoples: [
      {
        type: "number",
        name: "maxNoOfPeoples",
        label: "Max Number of peoples",
      },
    ],
  },
];

export { defaultProImg, defaultCoverImg, defaultMainCoverImg, postInputData };

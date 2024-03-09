const defaultProImg =
  "https://img.freepik.com/free-icon/user_318-875902.jpg?w=2000";

const defaultCoverImg =
  "https://t4.ftcdn.net/jpg/04/81/13/43/360_F_481134373_0W4kg2yKeBRHNEklk4F9UXtGHdub3tYk.jpg";

const defaultMainCoverImg =
  "https://images.unsplash.com/photo-1482398650355-d4c6462afa0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";

const loginInputData = [
  { color: "white", type: "text", name: "email", label: "Email" },
  { color: "white", type: "password", name: "password", label: "Password" },
];

const signupInputData = [
  { color: "white", type: "text", name: "name", label: "Name" },
  { color: "white", type: "text", name: "email", label: "Email" },
  { color: "white", type: "password", name: "password", label: "Password" }
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
        label: "Description"
      }
   
  
];

export {
  defaultProImg,
  defaultCoverImg,
  defaultMainCoverImg,
  loginInputData,
  signupInputData,
  postInputData,
};

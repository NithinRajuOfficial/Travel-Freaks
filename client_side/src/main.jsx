import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import {store as reduxStore} from "./redux/store";
import { ThemeProvider } from "@material-tailwind/react";
import "./index.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={reduxStore}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

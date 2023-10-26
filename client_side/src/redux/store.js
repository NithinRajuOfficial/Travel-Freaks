import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./userSlice";
import postReducer from "./postSlice"
import adminReducer from './adminSlice'

// Define the configuration for redux persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user","post", "admin"],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    user: userReducer,
    post: postReducer,
    admin: adminReducer
  })
);

const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export { store, persistor };

import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import windowReducer from "src/features/window/redux/windowSlice";
import profileReducer from "src/features/profile/redux/profileSlice";

const listenerMiddleware = createListenerMiddleware();

export default configureStore({
  reducer: { window: windowReducer, profile: profileReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

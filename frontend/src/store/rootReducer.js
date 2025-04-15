// rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import hobbiesReducer from "./hobbiesSlice";
import interestsReducer from "./interestSlice";
import relationshipsReducer from "./relationshipsSlice";
import meetingsReducer from "./meetingsSlice";
import freeDaysReducer from "./freeDaysSlice";
import wishlistsReducer from "./wishlistsSlice";
import wishesReducer from "./wishesSlice";
import tasksReducer from "./tasksSlice";
import { logout } from "./authSlice";

const appReducer = combineReducers({
  auth: authReducer,
  hobbies: hobbiesReducer,
  interests: interestsReducer,
  relationships: relationshipsReducer,
  freeDays: freeDaysReducer,
  meetings: meetingsReducer,
  wishlists: wishlistsReducer,
  wishes: wishesReducer,
  tasks: tasksReducer,
});

const rootReducer = (state, action) => {
  if (logout.fulfilled.match(action)) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;

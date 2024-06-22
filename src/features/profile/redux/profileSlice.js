import { createSlice } from "@reduxjs/toolkit";

const defaultProfile = { id: 1, name: "Default", icon: "default" };
const getInitialProfileState = () => {
  const stored = localStorage.getItem("profileItems");
  if (stored)
    return {
      curProfile: defaultProfile,
      items: JSON.parse(stored),
    };
  return {
    curProfile: defaultProfile,
    items: [
      defaultProfile,
      { id: 2, name: "Game", icon: "game" },
      { id: 3, name: "Movie", icon: "movie" },
      { id: 4, name: "Music", icon: "music" },
    ],
  };
};

export const profileSlice = createSlice({
  name: "profile",
  initialState: getInitialProfileState(),
  // For simplicity, to combine multiple state updates in a single reducer.
  // This functions similarly to combineReducers, but skip writing the boilerplate for
  // the current test case.
  reducers: {
    appendItemAndUpdateCurrentProfile: (state, action) => {
      // Multiple state updates.
      state.items.push(action.payload);
      state.curProfile = action.payload;
      return state;
    },
    editItemAndUpdateCurrentProfile: (state, action) => {
      // Multiple state updates.
      const idx = state.items.findIndex((v) => v.id === action.payload.id);
      if (idx !== -1) state.items.splice(idx, 1, action.payload);
      state.curProfile = action.payload;
      return state;
    },
    deleteItemAndUpdateCurrentProfile: (state) => {
      // Multiple state updates.
      const idx = state.items.findIndex((v) => v.id === state.curProfile.id);
      state.items.splice(idx, 1);
      state.curProfile = state.items[idx - 1];
      return state;
    },
    moveUpItem: (state) => {
      const idx = state.items.findIndex((v) => v.id === state.curProfile.id);
      if (idx > 0) {
        const temp = state.items[idx - 1];
        state.items[idx - 1] = state.items[idx];
        state.items[idx] = temp;
      }
      return state;
    },
    moveDownItem: (state) => {
      const idx = state.items.findIndex((v) => v.id === state.curProfile.id);
      if (idx < state.items.length - 1) {
        const temp = state.items[idx + 1];
        state.items[idx + 1] = state.items[idx];
        state.items[idx] = temp;
      }
      return state;
    },
    setCurProfile: (state, action) => {
      state.curProfile = action.payload;
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  appendItemAndUpdateCurrentProfile,
  editItemAndUpdateCurrentProfile,
  deleteItemAndUpdateCurrentProfile,
  moveUpItem,
  moveDownItem,
  setCurProfile,
} = profileSlice.actions;

export default profileSlice.reducer;

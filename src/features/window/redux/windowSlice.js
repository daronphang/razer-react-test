import { createSlice } from "@reduxjs/toolkit";

export const windowSlice = createSlice({
  name: "window",
  initialState: {
    value: "Default",
  },
  reducers: {
    updateTitle: (state, action) => {
      state.value = action.payload;
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateTitle } = windowSlice.actions;

export default windowSlice.reducer;

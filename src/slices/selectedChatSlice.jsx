import { createSlice } from "@reduxjs/toolkit";

export const selectedChatSlice = createSlice({
  name: "selectedChat",
  initialState: {
    selectedChatInfo: null,
  },
  reducers: {
    selectedChatInfo: (state, action) => {
      state.selectedChatInfo = action.payload;
    },
  },
});

export const { selectedChatInfo } = selectedChatSlice.actions;

export default selectedChatSlice.reducer;

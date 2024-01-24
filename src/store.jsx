import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import selectedChatSlice from "./slices/selectedChatSlice";

export default configureStore({
  reducer: {
    userLoginInfo: userSlice,
    selectedChatInfo: selectedChatSlice,
  },
});

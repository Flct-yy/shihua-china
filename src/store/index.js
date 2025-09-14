import { configureStore } from "@reduxjs/toolkit";
import inputSlice from "./features/inputSlice";


export default configureStore({
  reducer: {
    input: inputSlice,
  },
});
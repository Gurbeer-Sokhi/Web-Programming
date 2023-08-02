import { configureStore } from "@reduxjs/toolkit";
import collectorReducer from "./reducers/collector";

export const store = configureStore({
  reducer: { collector: collectorReducer },
});

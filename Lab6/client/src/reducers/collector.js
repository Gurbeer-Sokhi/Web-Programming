import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

const initialState = [
  {
    id: uuid(),
    Collectorname: "Stanley",
    character: 0,
    isSelected: true,
    collection: [],
  },
];

export const collectorReducer = createSlice({
  name: "collector",
  initialState,
  reducers: {
    ADD_COLLECTOR: (state, action) => {
      state = state.push({
        id: uuid(),
        Collectorname: action.payload.Collectorname,
        character: 0,
        isSelected: false,
        collection: [],
      });
    },
    DELETE_COLLECTOR: (state, action) => {
      let index = state.findIndex((x) => x.id === action.payload.id);
      if (state[index].isSelected === false) {
        state.splice(index, 1);
      }
    },
    SELECT_COLLECTOR: (state, action) => {
      let index = state.findIndex((x) => x.id === action.payload.id);
      for (let i = 0; i < state.length; i++) {
        state[i].isSelected = false;
      }
      state[index].isSelected = true;
    },
    DESELECT_COLLECTOR: (state, action) => {
      let index = state.findIndex((x) => x.id === action.payload.id);
      state[index].isSelected = false;
    },
    INCREMENT: (state, action) => {
      let index = state.findIndex((x) => x.id === action.payload.id);
      console.log("index", index);
      state[index].character = state[index].character + 1;
      state[index].collection.push(action.payload.hero);
    },
    DECREMENT: (state, action) => {
      let index = state.findIndex((x) => x.id === action.payload.id);
      state[index].character -= 1;
      state[index].collection = state[index].collection.filter(
        (item) => item.id !== action.payload.hero.id
      );
    },
  },
});

export const {
  ADD_COLLECTOR,
  DELETE_COLLECTOR,
  SELECT_COLLECTOR,
  DESELECT_COLLECTOR,
  INCREMENT,
  DECREMENT,
} = collectorReducer.actions;

export default collectorReducer.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HistoryState {
  selectedHistoryId: number | null;
}

const initialState: HistoryState = {
  selectedHistoryId: null,
};

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    setSelectedHistoryId: (state, action: PayloadAction<number | null>) => {
      state.selectedHistoryId = action.payload;
    },
  },
});

export const { setSelectedHistoryId } = historySlice.actions;

export default historySlice.reducer;

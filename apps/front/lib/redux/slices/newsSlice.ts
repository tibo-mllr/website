import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type NewsState = {
  showNew: boolean;
};

const initialState: NewsState = {
  showNew: false,
};

export const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    switchShowNewNews(state, action: PayloadAction<boolean>) {
      state.showNew = action.payload;
    },
  },
  selectors: {
    selectShowNewNews: (state) => state.showNew,
  },
});

export const { switchShowNewNews } = newsSlice.actions;

export const { selectShowNewNews } = newsSlice.selectors;

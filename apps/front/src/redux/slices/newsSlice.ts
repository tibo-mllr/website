import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NewsDocument } from 'home';

type NewsState = {
  allNews: NewsDocument[];
  isLoading: boolean;
  showNew: boolean;
};

const initialState: NewsState = {
  allNews: [],
  isLoading: false,
  showNew: false,
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    requestNews(state) {
      state.isLoading = true;
    },
    receiveNews(state, action: PayloadAction<NewsDocument[]>) {
      state.allNews = action.payload;
      state.isLoading = false;
    },
    addNews(state, action: PayloadAction<NewsDocument>) {
      state.allNews.push(action.payload);
    },
    deleteNews(state, action: PayloadAction<string>) {
      state.allNews = state.allNews.filter(
        (news) => news._id !== action.payload,
      );
    },
    editNews(state, action: PayloadAction<NewsDocument>) {
      state.allNews = state.allNews.map((news) =>
        news._id === action.payload._id ? action.payload : news,
      );
    },
    switchShowNewNews(state, action: PayloadAction<boolean>) {
      state.showNew = action.payload;
    },
  },
});

export const {
  requestNews,
  receiveNews,
  addNews,
  deleteNews,
  editNews,
  switchShowNewNews,
} = newsSlice.actions;

export default newsSlice.reducer;

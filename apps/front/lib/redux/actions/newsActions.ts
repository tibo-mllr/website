import { API } from '@/lib/api';

import { receiveNews, requestNews } from '../slices';
import { type AppThunk } from '../types';

export function fetchNews(): AppThunk {
  return async (dispatch) => {
    try {
      dispatch(requestNews());

      const allNews = await API.getNews();

      dispatch(receiveNews(allNews));
    } catch (error) {
      console.error(error);
      dispatch(receiveNews([]));
    }
  };
}

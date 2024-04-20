import { client, type NewsDocument } from '@/lib/utils';
import { receiveNews, requestNews } from '../slices';
import { type AppThunk } from '../types';

export function fetchNews(): AppThunk {
  return async (dispatch) => {
    try {
      dispatch(requestNews());

      const { data } = await client.get<NewsDocument[]>('/news');

      dispatch(receiveNews(data));
    } catch (error) {
      console.error(error);
      dispatch(receiveNews([]));
    }
  };
}

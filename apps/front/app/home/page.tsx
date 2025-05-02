import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@mui/material';
import { type ReactElement } from 'react';

import { API } from '@/lib/api';

import { CreateNewsModal, NewsActionsWrapper, NewsWebSockets } from './ui';

export default async function HomeView(): Promise<ReactElement> {
  const allNews = await API.getNews();

  if (!allNews.length) return <i>Nothing to display</i>;

  return (
    <>
      {allNews.map((news) => (
        <Card key={news._id} className="my-3">
          <CardHeader title={news.title} />
          <CardContent>
            <Typography>{news.content}</Typography>
          </CardContent>
          <CardActions>
            <Grid container alignItems="center" width="100%">
              <Grid>
                {new Date(news.date).toLocaleDateString()} by{' '}
                {news.author.username}
                {!!news.edited && (
                  <>
                    {' - '}
                    <i>
                      Edited {news.editor ? 'by ' + news.editor.username : ''}
                    </i>
                  </>
                )}
              </Grid>
              <NewsActionsWrapper news={news} />
            </Grid>
          </CardActions>
        </Card>
      ))}
      <CreateNewsModal />
      <NewsWebSockets />
    </>
  );
}

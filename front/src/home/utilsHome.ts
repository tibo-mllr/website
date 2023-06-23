export type News = {
  title: string;
  content: string;
  date: Date;
  author: { username: string };
  edited?: boolean;
  editor?: { username: string };
};

export type NewsDocument = News & {
  _id: string;
};

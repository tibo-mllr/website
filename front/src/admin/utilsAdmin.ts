export enum Role {
  Admin = 'admin',
  SuperAdmin = 'superAdmin',
}

export type User = {
  role: Role;
  username: string;
  password: string;
};

export type UserDocument = User & {
  _id: string;
};

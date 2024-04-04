export type User = UserInfo & {
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserInfo = {
  _id: string;
  userName: string;
  email: string;
  isVerified: boolean;
};

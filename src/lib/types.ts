export type Credentials = {
  email: string;
  password: string;
};

export type PublicUser = {
  id: string;
  email: string;
};

export type AuthData = {
  user: PublicUser;
  token: string;
  firebaseToken: string;
  expiresIn: string;
};

export type AuthResponse = {
  code: number;
  status: string;
  message: string;
  data: AuthData;
};

export type ContactInput = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
};

export type Contact = ContactInput & {
  id: string;
  ownerId?: string;
};

export type ApiErrorResponse = {
  code?: number;
  status?: string;
  message?: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
};

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface DecodedToken {
  username: string;
  sub: string;
  iat: string;
  exp: string;
}

export interface ChangePasswordCredentials {
  username: string;
  newPassword: string;
}

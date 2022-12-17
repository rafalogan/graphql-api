import { IProfile } from "./profile";

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  profiles?: IProfile[];
}


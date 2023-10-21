export interface IUserRegister {
  name: string;
  email: string;
  password: string;
  isProvider: boolean;
}

export interface IUser {
  name: string;
  lastName: string;
  email: string;
  password: string;
  isProvider: boolean;
  dateOfBirth?: Date;
  address?: IUserAddress;
  phone?: string;
  profilePicture?: string;
}
//To Define user Localizacion.
export interface IUserAddress {
  street: string;
  number: number;
  city: string;
}

export interface IUserProfileUpdate {
  email: string;
  name?: string;
  password?: string;
  profilePicture?: string;
}

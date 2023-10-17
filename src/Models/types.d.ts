export interface IUserRegister {
  name: string;
  email: string;
  password: string;
  isProvider: string;
}

export interface IUser {
  name: string;
  lastName: string;
  email: string;
  password: string;
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

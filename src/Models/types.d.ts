export interface IUserRegister {
  name: string;
  email: string;
  dni?: string;
  address?: string;
  phone?: string;
  password: string;
  isProvider: boolean;
}

export interface IUser {
  name: string;
  lastName: string;
  email: string;
  dni: string;
  password: string;
  isProvider: boolean;
  createdOn?: Date;
  dateOfBirth?: Date;
  address?: string;
  phone?: string;
  profilePicture?: string;
}
//To Define user Localizacion.

export interface IUserProfileUpdate {
  name?: string;
  email: string;
  dni?: string;
  address?: string;
  phone?: string;
  password?: string;
}

export interface IUserAuthenticated {
  email: string;
  password: string;
  profilePicture?: string;
  isProvider: boolean;
  createdOn?: Date;
  name?: string;
  dni?: string;
  address?: string;
  phone?: string;
}

interface GoogleProfile {
  displayName: string;
  emails: { value: string }[];
}

export interface ISupplier {
  name: string;
  businessName: string;
  cuil: string;
  domain: string;
  address: string;
  phone: string;
  category: string;
  email: string;
  brandingColors: string;
  coverPhoto?: string;
  logo?: string;
  password: string;
}

export interface ISupplierUpdate {
  name?: string;
  businessName?: string;
  cuil: string;
  domain?: string;
  address?: string;
  phone?: string;
  category?: string;
  email?: string;
  brandingColors?: string;
  coverPhoto?: string;
  logo?: string;
}

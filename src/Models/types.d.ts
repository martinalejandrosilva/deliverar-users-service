export interface IUserRegister {
  name: string;
  email: string;
  dni?: string;
  address?: string;
  phone?: string;
  password: string;
}

export interface IUser {
  name: string;
  lastName: string;
  email: string;
  dni: string;
  password: string;
  createdOn: Date;
  dateOfBirth?: Date;
  address?: string;
  phone?: string;
  profilePicture?: string;
  isProvider: boolean;
  isEmployee?: boolean;
  group?: string;
  discount?: number;
  vip?: boolean;
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
  createdOn?: Date;
  name?: string;
  dni?: string;
  address?: string;
  phone?: string;
  isProvider: boolean;
}

interface GoogleProfile {
  displayName: string;
  emails: { value: string }[];
  photos: { value: string }[];
}

export interface ISupplier {
  name: string;
  businessName: string;
  cuit: string;
  domain: string;
  address: string;
  phone: string;
  category: string;
  email: string;
  primaryColor: string;
  secondaryColor: string;
  coverPhoto?: string;
  logo?: string;
  password: string;
  isProvider: boolean;
  createdOn: Date;
}

export interface ISupplierRegister {
  name: string;
  businessName: string;
  cuit: string;
  domain: string;
  address: string;
  phone: string;
  category: string;
  email: string;
  primaryColor: string;
  secondaryColor: string;
  password: string;
}

export interface ISupplierUpdate {
  name?: string;
  businessName?: string;
  cuit: string;
  domain?: string;
  address?: string;
  phone?: string;
  category?: string;
  email?: string;
  primaryColor?: string;
  secondaryColor?: string;
  password?: string;
}

export type Sender = "usuarios" | "admin-personal";
export type EventName = "new_user_create" | "new_company_create" | "user_supplier_count" | "user_employee_password_change" | "login_user" | "new_user_employee_create"; 
export type GroupNumber = "500" | "501" | "502" | "504" | "505" | "507" | "508" | "509" | undefined;
export interface IEvent<T> {
  sender: sender;
  created_at: Number;
  event_name: string;
  data: T;
}

export interface IEmployee {
  username: string;
  password: string;
  nombre: string;
  apellido: string;
  email: string;
  carLicense: string;
  grupo : GroupNumber;
}


export type sender = "usuarios";

export type UserEmployeePasswordChange = {
  username: string;
  newPassword : string; 
  email : string; 
  dni: string;
}

export type createUserEventPayload = {
  username: string;
  password: string;
  name: string;
  email: string;
  document: string;
  address : string;
  role? : string;
};

export type createUserEmployeePayload = {
  name: string;
  email: string;
  dni: string;
  address: string;
  phone: string;
  createdOn: Date;
  password: string;
  discount : number;
  vip : boolean;
}

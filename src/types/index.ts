export interface IUserAddress {
  display_name?: string;
  lat?: number;
  lon?: number;
  address?: string;
}

export interface IUser {
  _id: string;
  name?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'user';
  image?: string;
  address?: IUserAddress[];
  refreshToken?: string;
}

export interface ICategory {
  _id: string;
  name?: string;
  description?: string;
  createAt?: Date;
}

export interface IPet {
  _id: string;
  name?: string;
  species?: string;
  generic?: string;
  gender?: boolean;
  age?: number;
  breed?: string;
  price?: number;
  description?: string;
  image_url?: string;
  status?: 'available' | 'sold';
  createdAt?: Date;
}

export interface IOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface IOrder {
  _id: string;
  userId: string;
  itemType: 'Product' | 'Pet';
  itemIdType: string;
  items: IOrderItem[];
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface IAppointment {
  _id: string;
  userId: string;
  categoryAppointment: string;
  time: Date;
  status?: string;
  createdAt?: Date;
}

export interface ISpecies {
  _id: string;
  name: string;
  description?: string;
  createdAt?: Date;
}

export interface IBrand {
  name: string;
  image?: string;
  description?: string;
  createdAt?: Date;
}

export interface IProduction {
  _id: string;
  name: string;
  category: string;
  stock?: number;
  price: number;
  image_url?: string;
  brand?: string;
  description?: string;
  createdAt?: Date;
}

export interface IReview {
  _id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INotification {
  _id: string;
  userId: string;
  message: string;
  type: string;
  isRead?: boolean;
  createdAt?: Date;
}

export interface ICartItem {
  itemId: string;
  itemType: 'Pet' | 'Product';
  quantity: number;
  price: number;
}

export interface ICart {
  _id: string;
  userId: string;
  items: ICartItem[];
  totalQuantity?: number;
  totalPrice?: number;
  createdAt?: Date;
}

export interface IWishlistItem {
  itemId: string;
  itemType: 'Pet' | 'Product';
}

export interface IWishlist {
  _id: string;
  userId: string;
  items: IWishlistItem[];
  createdAt?: Date;
}
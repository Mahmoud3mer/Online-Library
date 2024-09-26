import { ReviewInterface } from "./ReviewInterface";

export interface BookInterface {
  _id: string;
  title: string;
  price: number;
  publishedDate: Date | undefined;
  coverImage: any;
  description: string;
  averageRating: number;
  stock: number;
  pages: number;
  reviews: Array<ReviewInterface>;
  category: CategoryInterface;
  author: AuthorInterface;
}

export interface CategoryInterface {
  _id: string,
  name: string,
  image: string
}

export interface AuthorInterface {
  _id:string,
  name: string,
  image: string,
  bio: string
}

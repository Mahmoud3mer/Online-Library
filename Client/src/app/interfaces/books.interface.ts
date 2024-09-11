export interface BookInterface {
    title: string;
    price: number;
    publishedDate: Date;
    coverImage: string;
    description: string;
    rating: number;
    pages: number;
    stock: number;
    category: CategoryInterface;
    author: AuthorInterface;
}

export interface CategoryInterface{
  name: string,
  image: string
}
export interface AuthorInterface{
  name: string,
  bio: string
}

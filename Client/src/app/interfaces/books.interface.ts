export interface BookInterface {
    title: string;
    price: number;
    publishedDate: Date;
    coverImage: string;
    description: string;
    rating: number;
    pages: number;
    stock: number;
    category: category;
    author: author;
}

export interface category{
  name: string,
  image: string
}
export interface author{
  name: string,
  bio: string
}

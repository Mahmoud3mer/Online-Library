import { BookInterface } from "./books.interface";
import { UserInterface } from "./user.interface";


export interface ReviewInterface {

    user: UserInterface,
    book: BookInterface,
    rating: number,
    comment: string,
    date: Date,

}
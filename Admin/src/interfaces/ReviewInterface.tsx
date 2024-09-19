import { BookInterface } from "./BookInterface";
import { UserInterface } from "./UserInterface";


export interface ReviewInterface {

    user: UserInterface,
    book: BookInterface,
    rating: number,
    comment: string,
    date: Date,

}
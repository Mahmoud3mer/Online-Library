import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { BookDTO } from './bookdto/book.dto';
import { BookService } from './book.service';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDTO } from './bookdto/pagination.dto';
import { Role } from 'src/core/EnumRoles/role.enum';

@Controller('book')
@UseGuards(AuthGuard) //! for all controller
export class BookController {
    constructor(private _bookService: BookService){}

    @Post()
    @Roles(Role.Author, Role.Admin) //! Rolles for guar (athorization)
    @UseInterceptors(FileInterceptor('image')) //! pload file (image)
    addBook(@Body() body: any , @UploadedFile() file: Express.Multer.File){
        return this._bookService.addNewBook(body , file);
    }

    @Get()
    @Roles(Role.Author, Role.Admin) 
    getBooks(@Query() paginationDTO: PaginationDTO){
        return this._bookService.getAllBooks(paginationDTO);
    }

    @Get('/:id')
    @Roles(Role.Author, Role.Admin) 
    getBook(@Param('id') id : string){
        return this._bookService.getOneBook(id);
    }

    @Put('/:id')
    @Roles(Role.Author) 
    updateBook(@Param('id') id : string , @Body() body: any, @Req() req: any){
        let user = req.user;
        // return user
        return this._bookService.updateThisBook(id , body , user);
    }

    @Delete('/:id')
    @Roles(Role.Author, Role.Admin) 
    deleteBook(@Param('id') id : string){
        return this._bookService.removeBook(id);
    }
//   constructor(private _bookService: BookService) {}

//   @Post()
//   @Roles(Role.Author, Role.Admin) //! Rolles for guar (athorization)
//   @UseInterceptors(FileInterceptor('image')) //! pload file (image)
//   addBook(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
//     return this._bookService.addNewBook(body, file);
//   }

//   @Get()
//   @Roles(Role.Author, Role.Admin)
//   getBooks(@Query() paginationDTO: PaginationDTO) {
//     return this._bookService.getAllBooks(paginationDTO);
//   }

//   @Get('/:id')
//   @Roles(Role.Author, Role.Admin)
//   getBook(@Param('id') id: string) {
//     return this._bookService.getOneBook(id);
//   }

//   @Put('/:id')
//   @Roles(Role.Author)
//   updateBook(@Param('id') id: string, @Body() body: any, @Req() req: any) {
//     let user = req.user;
//     // return user
//     return this._bookService.updateThisBook(id, body, user);
//   }

//   @Delete('/:id')
//   @Roles(Role.Author, Role.Admin)
//   deleteBook(@Param('id') id: string) {
//     return this._bookService.removeBook(id);
//   }
// >>>>>>> 945094a30b1fd6c10f26d7307aaa6fa7613b4236
}

import {
  Body, Controller, Delete, Get, Param,
  Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors
} from '@nestjs/common';
// import { BookDTO } from './bookdto/book.dto';
import { BookService } from './book.service';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDTO } from './bookdto/pagination.dto';
import { Role } from 'src/core/EnumRoles/role.enum';


@Controller('books')
export class BookController {
  constructor(private _bookService: BookService) { }

  @Post()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin) //! Rolles for guar (athorization)

  @UseInterceptors(FileInterceptor('image')) //! pload file (image)
  addBook(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    return this._bookService.addNewBook(body, file);
  }

  @Get()
  getBooks(@Query() paginationDTO: PaginationDTO) {
    return this._bookService.getAllBooks(paginationDTO);
  }

  @Get('/:id')
  getBook(@Param('id') id: string) {
    return this._bookService.getOneBook(id);
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)

  updateBook(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    const user = req.user;
    // return user
    return this._bookService.updateThisBook(id, body, user);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  deleteBook(@Param('id') id: string) {
    return this._bookService.removeBook(id);
  }

}

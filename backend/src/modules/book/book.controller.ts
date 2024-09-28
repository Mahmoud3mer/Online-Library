import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
// import { BookDTO } from './bookdto/book.dto';
import { BookService } from './book.service';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDTO } from './bookdto/pagination.dto';
import { Role } from 'src/core/EnumRoles/role.enum';
import { OrderedBookDto, UpdateStockDto } from './bookdto/updateStock.dto';

@Controller('books')
export class BookController {
  constructor(private _bookService: BookService) {}

  //update stock
  @UseGuards(AuthGuard)
  @Patch('update-stock')
  async updateStock(@Body() updateStockDto: UpdateStockDto) {
    return await this._bookService.updateStock(updateStockDto.books);
  }

  //check stock
  @Post('check-stock')
  async checkStock(@Body() booksInCart: OrderedBookDto[]) {
    return await this._bookService.checkStock(booksInCart);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin) //! Rolles for guar (athorization)
  @UseInterceptors(FileInterceptor('coverImage')) //! pload file (image)
  addBook(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    return this._bookService.addNewBook(body, file);
  }

  @Get('recommendations')
  async getBooksByRecommendation(
    @Query() paginationDTO: PaginationDTO,
    @Query('categories') categories: string,
  ) {
    // Split the categories string into an array by commas
    const categoryArray = categories
      ? categories.split(',').map((cat) => cat.trim())
      : [];

    return await this._bookService.getBooksByRecommendation(
      paginationDTO,
      categoryArray,
    );
  }

  @Get()
  getBooks(
    @Query() paginationDTO: PaginationDTO,
    @Query('category') category: string,
    @Query('author') author: string,
    @Query('title') title: string,
    @Query('sortField') sortField: string,
    @Query('sortOrder') sortOrder: string,
  ) {
    return this._bookService.getAllBooks(
      paginationDTO,
      category,
      author,
      title,
      sortField,
      sortOrder,
    );
  }

  @Get('search')
  async searchBooksByAuthor(
    @Query()paginationDTO:PaginationDTO ,
    @Query('author') author: string,
    @Query('title') title: string
  ) {
    return this._bookService.findByAuthorOrTitle(paginationDTO,author,title);
  }

  @Get('/:id')
  getBook(@Param('id') id: string) {
    return this._bookService.getOneBook(id);
  }

  @Patch('/:id')
  // @UseGuards(AuthGuard)
  // @Roles(Role.Admin, Role.User)
  @UseInterceptors(FileInterceptor('coverImage'))
  updateBook(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = req.user;
    // return user
    return this._bookService.updateThisBook(id, body, user, file);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  deleteBook(@Param('id') id: string) {
    return this._bookService.removeBook(id);
  }
}

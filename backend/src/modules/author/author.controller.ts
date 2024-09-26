import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthorService } from './author.service';
import { PaginationDTO } from '../book/bookdto/pagination.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from 'src/core/EnumRoles/role.enum';
import { AuthorDTO } from './dto/Author.DTO';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('authors')
export class AuthorController {
    constructor(private readonly _authorService: AuthorService) { }



    @Get()
    getAllAuthors(@Query() paginationDTO: PaginationDTO) {
        return this._authorService.getAllAuthors(paginationDTO);
    }

    @Get(':id')
    getAuthorById(@Param('id') id: string) {
        return this._authorService.getAuthorById(id);
    }

    @Post()
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    @UseInterceptors(FileInterceptor('image')) //! upload file (image)
    addNewAuthor(@Body() authorDTO: AuthorDTO, @UploadedFile() file: Express.Multer.File) {
        const res = this._authorService.addNewAuthor(authorDTO, file);
        return res;
    }

    @Patch(':id')
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    @UseInterceptors(FileInterceptor('image'))
    updateAuthor(@Param('id') id: string, @Body() authorDTO: AuthorDTO, @UploadedFile() file: Express.Multer.File) {
        return this._authorService.updateAuthor(id, authorDTO, file);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    deleteAuthor(@Param('id') id: string) {
        return this._authorService.deleteAuthor(id);
    }
}
//   constructor(private readonly _authorService: AuthorService) {}


  
//   @Get()
//   getAllAuthors(@Query() paginationDTO: PaginationDTO) {
//       return this._authorService.getAllAuthors(paginationDTO);
//   }

//   @Get(':id')
//   getAuthorById(@Param('id') id: string) {
//       return this._authorService.getAuthorById(id);
//   }

//   @Post()
//   @UseGuards(AuthGuard)
//   @Roles(Role.Admin)
//   @UseInterceptors(FileInterceptor('image')) //! pload file (image)
//   addNewAuthor(@Body() authorDTO: AuthorDTO, @UploadedFile() file: Express.Multer.File) {
//       const res = this._authorService.addNewAuthor(authorDTO,file);
//       return res;
//   }

//   @Patch(':id')
//   @UseGuards(AuthGuard)
//   @Roles(Role.Admin)
//   updateAuthor(@Param('id') id: string, @Body() authorDTO: AuthorDTO) {
//       return this._authorService.updateAuthor(id, authorDTO);
//   }

//   @Delete(':id')
//   @UseGuards(AuthGuard)
//   @Roles(Role.Admin)
//   deleteAuthor(@Param('id') id: string) {
//       return this._authorService.deleteAuthor(id);
//   }
// }

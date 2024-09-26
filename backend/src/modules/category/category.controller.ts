
import { Controller, Get, Post, Delete, Body, Param, UseGuards, Patch, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDTO } from './dto/Category.DTO';
import { PaginationDTO } from '../book/bookdto/pagination.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from 'src/core/EnumRoles/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    getAllCategories(@Query() paginationDTO: PaginationDTO,@Query('name') name: string) {
        return this.categoryService.getAllCategories(paginationDTO,name);
    }

    @Get(':id')
    getCategoryById(@Param('id') id: string) {
        return this.categoryService.getCategoryById(id);
    }

    @Post()
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    @UseInterceptors(FileInterceptor('image'))
    addNewCategory(@Body() categoryDTO: CategoryDTO, @UploadedFile() file: Express.Multer.File) {
        const res = this.categoryService.addNewCategory(categoryDTO, file);
        return res;
    }


    @Patch(':id')
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    @UseInterceptors(FileInterceptor('image'))
    updateCategory(@Param('id') id: string, @Body() categoryDTO: CategoryDTO, @UploadedFile() file: Express.Multer.File) {
        return this.categoryService.updateCategory(id, categoryDTO, file);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    deleteCategory(@Param('id') id: string) {
        return this.categoryService.deleteCategory(id);
    }
}

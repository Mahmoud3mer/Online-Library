
import { Controller, Get, Post, Delete, Body, Param, UseGuards, Patch, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDTO } from './dto/Category.DTO';
import { PaginationDTO } from '../book/bookdto/pagination.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from 'src/core/EnumRoles/role.enum';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()

    getAllCategories(@Query() paginationDTO: PaginationDTO) {
        return this.categoryService.getAllCategories(paginationDTO);
    }

    @Get(':id')
    getCategoryById(@Param('id') id: string) {
        return this.categoryService.getCategoryById(id);
    }

    @Post()
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    addNewCategory(@Body() categoryDTO: CategoryDTO) {
        const res = this.categoryService.addNewCategory(categoryDTO);
        return res;
    }


    @Patch(':id')
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    updateCategory(@Param('id') id: string, @Body() categoryDTO: CategoryDTO) {
        return this.categoryService.updateCategory(id, categoryDTO);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    deleteCategory(@Param('id') id: string) {
        return this.categoryService.deleteCategory(id);
    }
}

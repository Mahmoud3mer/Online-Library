import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
 
import { CategoryDTO } from './dto/Category.DTO';
 
import { AuthGuard } from 'src/core/guards/auth.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from 'src/core/EnumRoles/role.enum';
import { PaginationDTO } from 'src/modules/book/bookdto/pagination.dto';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    getAllCategories(@Body() paginationDTO: PaginationDTO) {
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

    @Put(':id')
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

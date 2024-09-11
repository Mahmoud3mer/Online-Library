import { Body, Controller, Delete, Get, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { UpdateUserDto } from '../dto/auth.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from 'src/core/EnumRoles/role.enum';
import { PaginationDTO } from 'src/modules/book/bookdto/pagination.dto';

@Controller('user-settings')
export class UserSettingsController {
  constructor(private readonly _userSettingsService: UserSettingsService) { }

  @UseGuards(AuthGuard)
  @Get()
  async getProfile(@Req() req: any) {
    const userId = req.user.userId;
    return this._userSettingsService.getUserProfile(userId);
  }

  @UseGuards(AuthGuard) 
  @Roles(Role.User) 
  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.userId; 
    return this._userSettingsService.updateUserProfile(userId, updateUserDto);
  }

  @UseGuards(AuthGuard) 
  @Roles(Role.User) 
  @Delete('profile') 
  async deleteProfile(@Req() req: any) {
    const userId = req.user.userId; // Extracted from token
    return this._userSettingsService.deleteAccount(userId);
  }


  //---------Admin Turn-----------

  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Get('admin/users')
  async getAllUsers(@Query() paginationDTO: PaginationDTO) {
    return this._userSettingsService.getAllUsers(paginationDTO)
  }


  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Patch('admin/users/:id') 
  async updateUserProfile(@Param('id') userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this._userSettingsService.updateUserProfile(userId, updateUserDto);
  }

  @UseGuards(AuthGuard) 
  @Roles(Role.Admin)
  @Delete('admin/users/:id') 
  async deleteUserProfile(@Param('id') userId: string) {
    return this._userSettingsService.deleteAccount(userId);
  }

}

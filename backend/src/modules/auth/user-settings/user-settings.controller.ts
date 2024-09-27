import { Body, Controller, Delete, Get, Param, Patch, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { UpdateUserDto } from '../dto/auth.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from 'src/core/EnumRoles/role.enum';
import { PaginationDTO } from 'src/modules/book/bookdto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @Roles(Role.User, Role.Admin) 
  @Patch('profile')
  @UseInterceptors(
    FileInterceptor('profilePic')
  )
  async updateProfile(@Req() req: any, @Body() body: any , @UploadedFile() file: Express.Multer.File) {
    // console.log('file:', file);
    // console.log('body:', body);
    const userId = req.user.userId; 
    return this._userSettingsService.updateUserProfile(userId, body , file);
  }

  @UseGuards(AuthGuard) 
  @Roles(Role.User, Role.Admin) 
  @Patch('password')
  async updateProfilePassword(@Req() req: any, @Body() body: any) {
    const userId = req.user.userId; 
    return this._userSettingsService.updateUserPassword(userId, body);
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
  async getAllUsers(@Query() paginationDTO: PaginationDTO, @Query('name') name: string) {
    return this._userSettingsService.getAllUsers(paginationDTO,name)
  }
// base/user-setting/admin/users

  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Patch('admin/users/:id') 
  @UseInterceptors(FileInterceptor('profileImage'))
  async updateUserProfile(@Param('id') userId: string, @Body() updateUserDto: UpdateUserDto,@UploadedFile() file: Express.Multer.File) {
    return this._userSettingsService.updateUserProfile(userId, updateUserDto ,file);
  }

  @UseGuards(AuthGuard) 
  @Roles(Role.Admin)
  @Delete('admin/users/:id') 
  async deleteUserProfile(@Param('id') userId: string) {
    return this._userSettingsService.deleteAccount(userId);
  }

}

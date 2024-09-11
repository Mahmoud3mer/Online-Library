import { Controller, Post, Body, Req, UseGuards, Get, Delete } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';

import { Role } from 'src/core/EnumRoles/role.enum';
import { Roles } from 'src/core/decorators/roles.decorator';
import { CreateRecommendationDTO, RecommendationDTO } from './dto/recommendation.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { UserDTO } from '../wishlist/dto/wishlist.dto';

@UseGuards(AuthGuard)
@Controller('recommendation')
export class RecommendationController {
  constructor(private _recommendationService: RecommendationService) {}

  // Create a new recommendation
  @Post()
  @Roles(Role.User)
  async createNewRecommendations( @Body() body: CreateRecommendationDTO, @Req() req: any) {
    body['userId'] = req.user.userId;
    return await this._recommendationService.createRecommendation(body);
  }

  
  @Roles(Role.User)
  @Get()
  async getRecommendation(@Req() req: any) {
    const userDTO: UserDTO = { userId: req.user.userId };
    return await this._recommendationService.getRecommendations(userDTO);
  }


  @Roles(Role.User)
  @Post('add')
  async addToRecommendation(@Body() body: RecommendationDTO,@Req() req:any) {
        body["userId"] = req.user.userId;
        return this._recommendationService.addToRecommendation(body);
 
  }
  @Delete()
  @Roles(Role.User) 
  async removeCategoryFromRecommendation(@Body() body:RecommendationDTO ,@Req() req:any) {
    body["userId"] = req.user.userId;
    return await this._recommendationService.deleteCategoryFromRecommendation(body);
  }
}

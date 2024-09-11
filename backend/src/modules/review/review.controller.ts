import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { reviewDTO } from './DTO/review.DTO';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { PaginationDTO } from '../book/bookdto/pagination.dto';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from 'src/core/EnumRoles/role.enum';

@Controller('review')
export class ReviewController {
  constructor(private readonly _reviewService: ReviewService,
    
  ) { }

  @UseGuards(AuthGuard)
  @Post()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async addReview(@Body() body: reviewDTO, @Req() req : any) {

    const userId = req.user.userId
    const res = await this._reviewService.addReview(userId,body);
    return res;
  }

  @Get()
  async getAllreviews(@Query() paginationDto : PaginationDTO) {
    const res = await this._reviewService.getAllReviews(paginationDto)
    return res;
  }

  @Get(':id')
  async getReviewById(@Param('id') id: string) {
    const res = await this._reviewService.getReviewById(id)
    return res;
  }

  @UseGuards(AuthGuard)
  @Roles(Role.User)
  @Put(':id')
  async updateReview(@Param('id') id: string, @Body() body: any,@Req() req: any) {
    const userId = req.user.userId
    const res = await this._reviewService.updateReview(id, body,userId)
    return res;
  }

  @UseGuards(AuthGuard)
  @Roles(Role.User,Role.Admin)
  @Delete(':id')
  async deleteReview(@Param('id') id: string , @Req() req: any) {
    const userId = req.user.userId
    const res = await this._reviewService.deleteReview(id, userId)
    return res;
  }

}

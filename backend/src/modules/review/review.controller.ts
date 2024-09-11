import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { reviewDTO } from './DTO/review.DTO';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { PaginationDTO } from '../book/bookdto/pagination.dto';

@Controller('review')
// @UseGuards(AuthGuard)
export class ReviewController {
  constructor(private readonly _reviewService: ReviewService,
    
  ) { }


  @Post()
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async addReview(@Body() body: reviewDTO, @Req() req : any) {
    const res = await this._reviewService.addReview(body);
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
  @Put(':id')
  async updateReview(@Param('id') id: string, @Body() body: any) {
    const res = await this._reviewService.updateReview(id, body)
    return res;
  }
  
  @Delete(':id')
  async deleteReview(@Param('id') id: string) {
    const res = await this._reviewService.deleteReview(id)
    return res;
  }

}

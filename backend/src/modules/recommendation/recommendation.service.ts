import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
 
import { CreateRecommendationDTO, RecommendationDTO } from './dto/recommendation.dto';
import { Recommendation } from 'src/core/schemas/recommendation.schema';
import { UserDTO } from '../wishlist/dto/wishlist.dto';
import { Category } from 'src/core/schemas/category.schema';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectModel(Recommendation.name)
    private recommendationModel: Model<Recommendation>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  // Create a new recommendation
  async createRecommendation(createRecommendationDto: CreateRecommendationDTO) {
    const existingRecommendation = await this.recommendationModel.findOne({
        user: createRecommendationDto.userId,
      });
  
      if (existingRecommendation) {
        throw new ConflictException('recommendation already exists for this user.');
      }
   
      // Create a new recommendation if no existing one is found
      const newRecommendation = new this.recommendationModel({
        user: createRecommendationDto.userId,
        recommendedCategories: createRecommendationDto.categories,
      });

      return newRecommendation.save();
 }

 

  // Get recommendations for a specific user
    async getRecommendations(userDTO: UserDTO) {
    const { userId } = userDTO;
    const recommendation = await this.recommendationModel
        .findOne({ user: userId })
    
    if (!recommendation) {  
        throw new NotFoundException('No recommendations found for this user');
    }
    await recommendation.populate('recommendedCategories');

    return {
        message: 'Recommendations retrieved successfully',
        data: recommendation,
    };
 
    } 

    async addToRecommendation(addRecommendationDTO: RecommendationDTO) {
        const { userId, category } = addRecommendationDTO;
        
        const categoryExists = await this.categoryModel.findById(category);
        if (!categoryExists) {
            throw new NotFoundException('Category not found');
        }
    
        const userRecommendation = await this.recommendationModel.findOne({ user: userId });
        
        // Check if recommendation exists; if not, throw an error
        if (!userRecommendation) {
            throw new NotFoundException('Recommendation not found for this user.');
        }
    
        // Check if the category already exists in the recommendation
        const existingCategory = userRecommendation.recommendedCategories.find(
            (categ) => categ.toString() === category.toString()
        );
      
        if (existingCategory) {
          throw new ConflictException('Category is already in the recommendation.');
        }
      
        // Add category to the recommendation
        userRecommendation.recommendedCategories.push(category);
      
        // Save the updated recommendation
        await userRecommendation.save();
    
        return {
            message: 'Category added to recommendation successfully',
            data: await this.recommendationModel
            .findOne({ user: userId })
            .populate('recommendedCategories') 
            .exec(),
        };
        }
    
    
   //Delete
    async deleteCategoryFromRecommendation(deleteDTO: RecommendationDTO) {
    const { userId, category } = deleteDTO;
    
    // Find the recommendation document for the user
    const recommendation = await this.recommendationModel.findOne({ user: userId });
    
    if (!recommendation) {
        throw new NotFoundException('No recommendations found for this user');
    }
  
    const initialLength = recommendation.recommendedCategories.length;
    
    // Filter out the category to be deleted
    recommendation.recommendedCategories = recommendation.recommendedCategories.filter(
        (categ) => !categ.equals(category),
    );
    
    // Check if any category was removed
    if (initialLength === recommendation.recommendedCategories.length) {
      throw new NotFoundException('Category not found in recommendations');
    }
  
    // Save the updated recommendation
    await recommendation.save();
  
    // Populate the updated categories if necessary
    await recommendation.populate('recommendedCategories');
  
    return {
      message: 'Category removed successfully from recommendations',
      data: recommendation,
    };
    }
    
}
    
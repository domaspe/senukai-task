import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from '../database/entities/promotion.entity';
import { CartItem } from '../database/entities/cart-item.entity';
import { PromotionStrategyService } from './promotion-strategy.service';

export type PromotionCalculation = {
  discountAmount: number;
  appliedPromotions: AppliedPromotion[];
};

export type AppliedPromotion = {
  name: string;
  discountAmount: number;
};

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,
    private readonly promotionStrategyService: PromotionStrategyService,
  ) {}

  async calculatePromotions(cartItems: CartItem[]): Promise<PromotionCalculation> {
    const promotions = await this.promotionRepository.find();
    let totalDiscountAmount = 0;
    const appliedPromotions: AppliedPromotion[] = [];

    for (const promotion of promotions) {
      try {
        const strategy = this.promotionStrategyService.getStrategy(promotion.type);

        if (strategy.isApplicable(cartItems, promotion)) {
          const result = strategy.apply(cartItems, promotion);

          if (result.discountAmount > 0) {
            totalDiscountAmount += result.discountAmount;
            appliedPromotions.push({
              name: promotion.name,
              discountAmount: result.discountAmount,
            });
          }
        }
      } catch (error) {
        console.warn(`Failed to apply promotion ${promotion.name}:`, error.message);
      }
    }

    return {
      discountAmount: totalDiscountAmount,
      appliedPromotions,
    };
  }
}

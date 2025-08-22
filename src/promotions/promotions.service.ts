import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from '../database/entities/cart-item.entity';
import { Promotion, PromotionLevel } from '../database/entities/promotion.entity';
import { PromotionStrategyService } from './promotion-strategy.service';
import { DiscountedItem } from './strategies/promotion-strategy.abstract';

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

    const itemLevelPromotions = this.promotionStrategyService.getPromotionByLevel(promotions, PromotionLevel.Item);
    const cartLevelPromotions = this.promotionStrategyService.getPromotionByLevel(promotions, PromotionLevel.Cart);

    const initialDiscountedItems = cartItems.map((item) => ({ ...item }) satisfies DiscountedItem);

    const itemPromotions = this.applyItemLevelPromotions(initialDiscountedItems, itemLevelPromotions);

    const cartPromotions = this.applyCartLevelPromotions(itemPromotions.discountedItems, cartLevelPromotions);

    const allAppliedPromotions = [...itemPromotions.appliedPromotions, ...cartPromotions];

    return {
      discountAmount: allAppliedPromotions.reduce((sum, promo) => sum + promo.discountAmount, 0),
      appliedPromotions: allAppliedPromotions,
    };
  }

  private applyItemLevelPromotions(
    discountedItems: DiscountedItem[],
    itemLevelPromotions: Promotion[],
  ): { discountedItems: DiscountedItem[]; appliedPromotions: AppliedPromotion[] } {
    let currentDiscountedItems = discountedItems;
    const appliedPromotions: AppliedPromotion[] = [];

    for (const promotion of itemLevelPromotions) {
      try {
        const strategy = this.promotionStrategyService.getStrategy(promotion.type);

        if (strategy.isApplicable(currentDiscountedItems, promotion)) {
          const { discountAmount, discountedItems: modifiedItems } = strategy.apply(currentDiscountedItems, promotion);

          if (discountAmount > 0) {
            appliedPromotions.push({
              name: promotion.name,
              discountAmount,
            });
          }

          currentDiscountedItems = modifiedItems;
        }
      } catch (error) {
        console.warn(`Failed to apply item promotion ${promotion.name}:`, error.message);
      }
    }

    return { discountedItems: currentDiscountedItems, appliedPromotions };
  }

  private applyCartLevelPromotions(
    discountedItems: DiscountedItem[],
    cartLevelPromotions: Promotion[],
  ): AppliedPromotion[] {
    const appliedPromotions: AppliedPromotion[] = [];

    for (const promotion of cartLevelPromotions) {
      try {
        const strategy = this.promotionStrategyService.getStrategy(promotion.type);

        if (strategy.isApplicable(discountedItems, promotion)) {
          const result = strategy.apply(discountedItems, promotion);

          if (result.discountAmount > 0) {
            appliedPromotions.push({
              name: promotion.name,
              discountAmount: result.discountAmount,
            });
          }
        }
      } catch (error) {
        console.warn(`Failed to apply cart promotion ${promotion.name}:`, error.message);
      }
    }

    return appliedPromotions;
  }
}

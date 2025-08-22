import { Injectable } from '@nestjs/common';
import { PromotionStrategy } from './strategies/promotion-strategy.abstract';
import { BuyXGetYStrategy } from './strategies/buy-x-get-y.strategy';
import { PercentageDiscountStrategy } from './strategies/percentage-discount.strategy';
import { Promotion, PromotionType, PromotionLevel } from '../database/entities/promotion.entity';

@Injectable()
export class PromotionStrategyService {
  constructor(
    private readonly buyXGetYStrategy: BuyXGetYStrategy,
    private readonly percentageDiscountStrategy: PercentageDiscountStrategy,
  ) {}

  getStrategy(promotionType: PromotionType): PromotionStrategy {
    switch (promotionType) {
      case PromotionType.BuyXGetY:
        return this.buyXGetYStrategy;
      case PromotionType.PercentageDiscount:
        return this.percentageDiscountStrategy;
    }
  }

  getPromotionsByLevel(promotions: Promotion[], level: PromotionLevel): Promotion[] {
    return promotions.filter((promotion) => {
      const strategy = this.getStrategy(promotion.type);
      return strategy.level === level;
    });
  }
}

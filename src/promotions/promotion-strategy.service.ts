import { Injectable } from '@nestjs/common';
import { PromotionStrategy } from './strategies/promotion-strategy.abstract';
import { BuyOneGetOneStrategy } from './strategies/buy-one-get-one.strategy';
import { PercentageDiscountStrategy } from './strategies/percentage-discount.strategy';
import { Promotion, PromotionType, PromotionLevel } from '../database/entities/promotion.entity';

@Injectable()
export class PromotionStrategyService {
  constructor(
    private readonly buyOneGetOneStrategy: BuyOneGetOneStrategy,
    private readonly percentageDiscountStrategy: PercentageDiscountStrategy,
  ) {}

  getStrategy(promotionType: PromotionType): PromotionStrategy {
    switch (promotionType) {
      case PromotionType.BuyOneGetOne:
        return this.buyOneGetOneStrategy;
      case PromotionType.PercentageDiscount:
        return this.percentageDiscountStrategy;
    }
  }

  getPromotionByLevel(promotions: Promotion[], level: PromotionLevel): Promotion[] {
    return promotions.filter((promotion) => {
      const strategy = this.getStrategy(promotion.type);
      return strategy.level === level;
    });
  }
}

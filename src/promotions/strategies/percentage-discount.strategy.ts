import { Injectable } from '@nestjs/common';
import { roundMoney } from 'src/utils';
import { Promotion, PromotionLevel } from '../../database/entities/promotion.entity';
import { DiscountedItem, PromotionResult, PromotionStrategy } from './promotion-strategy.abstract';

@Injectable()
export class PercentageDiscountStrategy extends PromotionStrategy {
  level = PromotionLevel.Cart;

  apply(discountedItems: DiscountedItem[], promotion: Promotion): PromotionResult {
    const total = discountedItems.reduce((sum, item) => sum + item.totalPrice, 0);

    const discountValue = promotion.discountValue ?? 0;
    const discountAmount = roundMoney((total * discountValue) / 100);

    return { discountAmount, discountedItems };
  }

  isApplicable(discountedItems: DiscountedItem[], promotion: Promotion): boolean {
    const total = discountedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    return total >= (promotion.minimumOrderValue ?? 0);
  }
}

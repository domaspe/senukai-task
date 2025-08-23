import { Injectable } from '@nestjs/common';
import { roundMoney } from '../../utils';
import { Promotion, PromotionLevel } from '../../database/entities/promotion.entity';
import { DiscountedItem, PromotionResult, PromotionHandler } from './promotion-handler.abstract';

@Injectable()
export class PercentageDiscountHandler extends PromotionHandler {
  level = PromotionLevel.Cart;

  apply(discountedItems: DiscountedItem[], promotion: Promotion): PromotionResult {
    const total = discountedItems.reduce((sum, item) => sum + item.totalPrice, 0);

    const discountValue = promotion.discountValue ?? 0;
    const discountAmount = roundMoney((total * discountValue) / 100);

    return { discountAmount, discountedItems };
  }

  shouldApply(discountedItems: DiscountedItem[], promotion: Promotion): boolean {
    const total = discountedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    return total >= (promotion.minimumOrderValue ?? 0);
  }
}

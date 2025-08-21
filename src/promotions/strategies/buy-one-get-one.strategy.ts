import { Injectable } from '@nestjs/common';
import { roundMoney } from 'src/utils';
import { Promotion, PromotionLevel } from '../../database/entities/promotion.entity';
import { DiscountedItem, PromotionResult, PromotionStrategy } from './promotion-strategy.abstract';

@Injectable()
export class BuyOneGetOneStrategy extends PromotionStrategy {
  level = PromotionLevel.Item;

  apply(discountedItems: DiscountedItem[], promotion: Promotion): PromotionResult {
    const targetItem = discountedItems.find((item) => item.productId === promotion.productId);

    if (!targetItem) {
      return { discountAmount: 0, discountedItems };
    }

    const freeItems = Math.floor(targetItem.quantity / 2);
    const discountAmount = roundMoney(freeItems * targetItem.unitPrice);

    if (discountAmount > 0) {
      return {
        discountAmount,
        discountedItems: discountedItems.map((item) => ({
          ...item,
          totalPrice:
            item.productId === promotion.productId ? Math.max(item.totalPrice - discountAmount, 0) : item.totalPrice,
        })),
      };
    }

    return {
      discountAmount,
      discountedItems,
    };
  }

  isApplicable(discountedItems: DiscountedItem[], promotion: Promotion): boolean {
    const targetItem = discountedItems.find((item) => item.productId === promotion.productId);
    return !!targetItem && targetItem.quantity >= 2;
  }
}

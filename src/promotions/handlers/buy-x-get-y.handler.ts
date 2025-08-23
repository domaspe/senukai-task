import { Injectable } from '@nestjs/common';
import { Promotion, PromotionLevel } from '../../database/entities/promotion.entity';
import { DiscountedItem, PromotionResult, PromotionHandler } from './promotion-handler.abstract';
import { roundMoney } from '../../utils';

@Injectable()
export class BuyXGetYHandler extends PromotionHandler {
  level = PromotionLevel.Item;

  apply(discountedItems: DiscountedItem[], promotion: Promotion): PromotionResult {
    const targetItem = discountedItems.find((item) => item.productId === promotion.productId);

    if (!targetItem) {
      return { discountAmount: 0, discountedItems };
    }

    const buyCount = promotion.buyCount!;
    const freeCount = promotion.freeCount!;

    const discountSets = Math.floor(targetItem.quantity / (buyCount + freeCount));
    const totalFreeItems = discountSets * freeCount;

    const discountAmount = roundMoney(totalFreeItems * targetItem.unitPrice);

    if (discountAmount === 0) {
      return { discountAmount: 0, discountedItems };
    }

    return {
      discountAmount,
      discountedItems: discountedItems.map((item) => ({
        ...item,
        totalPrice:
          item.productId === promotion.productId
            ? Math.max(roundMoney(item.totalPrice - discountAmount), 0)
            : item.totalPrice,
      })),
    };
  }

  shouldApply(discountedItems: DiscountedItem[], promotion: Promotion): boolean {
    const targetItem = discountedItems.find((item) => item.productId === promotion.productId);
    const discountableQuantity = promotion.buyCount! + promotion.freeCount!;
    return !!targetItem && targetItem.quantity >= discountableQuantity;
  }
}

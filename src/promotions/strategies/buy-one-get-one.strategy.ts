import { Injectable } from '@nestjs/common';
import { PromotionStrategy, PromotionResult } from './promotion-strategy.abstract';
import { CartItem } from '../../database/entities/cart-item.entity';
import { Promotion } from '../../database/entities/promotion.entity';
import { roundMoney } from 'src/utils';

@Injectable()
export class BuyOneGetOneStrategy extends PromotionStrategy {
  apply(cartItems: CartItem[], promotion: Promotion): PromotionResult {
    const targetItem = cartItems.find((item) => item.productId === promotion.productId);

    if (!targetItem) {
      return { discountAmount: 0 };
    }

    const freeItems = Math.floor(targetItem.quantity / 2);
    const discountAmount = roundMoney(freeItems * targetItem.unitPrice);

    return { discountAmount };
  }

  isApplicable(cartItems: CartItem[], promotion: Promotion): boolean {
    const targetItem = cartItems.find((item) => item.productId === promotion.productId);
    return !!targetItem && targetItem.quantity >= 2;
  }
}

import { Injectable } from '@nestjs/common';
import { PromotionStrategy, PromotionResult } from './promotion-strategy.abstract';
import { CartItem } from '../../database/entities/cart-item.entity';
import { Promotion } from '../../database/entities/promotion.entity';
import { roundMoney } from 'src/utils';

@Injectable()
export class PercentageDiscountStrategy extends PromotionStrategy {
  apply(cartItems: CartItem[], promotion: Promotion): PromotionResult {
    const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

    const discountValue = promotion.discountValue ?? 0;
    const discountAmount = roundMoney((total * discountValue) / 100);

    return { discountAmount };
  }

  isApplicable(cartItems: CartItem[], promotion: Promotion): boolean {
    const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    return total >= (promotion.minimumOrderValue ?? 0);
  }
}

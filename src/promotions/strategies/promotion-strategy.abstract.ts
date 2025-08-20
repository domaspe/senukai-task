import { CartItem } from '../../database/entities/cart-item.entity';
import { Promotion } from '../../database/entities/promotion.entity';

export type PromotionResult = {
  discountAmount: number;
};

export abstract class PromotionStrategy {
  abstract apply(cartItems: CartItem[], promotion: Promotion): PromotionResult;
  abstract isApplicable(cartItems: CartItem[], promotion: Promotion): boolean;
}

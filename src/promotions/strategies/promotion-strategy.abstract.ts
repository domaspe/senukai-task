import { Promotion, PromotionLevel } from '../../database/entities/promotion.entity';

export type DiscountedItem = {
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type PromotionResult = {
  discountAmount: number;
  discountedItems: DiscountedItem[];
};

export abstract class PromotionStrategy {
  abstract apply(discountedItems: DiscountedItem[], promotion: Promotion): PromotionResult;
  abstract isApplicable(discountedItems: DiscountedItem[], promotion: Promotion): boolean;
  abstract level: PromotionLevel;
}

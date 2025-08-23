import { Promotion, PromotionType } from '../../database/entities/promotion.entity';
import { PercentageDiscountHandler } from './percentage-discount.handler';
import { DiscountedItem } from './promotion-handler.abstract';

describe('PercentageDiscountHandler', () => {
  let strategy: PercentageDiscountHandler;

  beforeEach(() => {
    strategy = new PercentageDiscountHandler();
  });

  describe('shouldApply', () => {
    it('should return true when cart total meets minimum order value', () => {
      const promotion: Promotion = {
        id: 1,
        name: '10% off orders over $75',
        type: PromotionType.PercentageDiscount,
        discountValue: 10,
        minimumOrderValue: 75,
      };
      const discountedItems: DiscountedItem[] = [{ productId: 1, quantity: 4, unitPrice: 25, totalPrice: 100 }];

      expect(strategy.shouldApply(discountedItems, promotion)).toBe(true);
    });

    it('should return false when cart total is below minimum order value', () => {
      const promotion: Promotion = {
        id: 2,
        name: '10% off orders over $75',
        type: PromotionType.PercentageDiscount,
        discountValue: 10,
        minimumOrderValue: 75,
      };
      const discountedItems: DiscountedItem[] = [{ productId: 1, quantity: 2, unitPrice: 25, totalPrice: 50 }];

      expect(strategy.shouldApply(discountedItems, promotion)).toBe(false);
    });

    it('should return true when no minimum order value is set', () => {
      const promotion: Promotion = {
        id: 3,
        name: '5% off everything',
        type: PromotionType.PercentageDiscount,
        discountValue: 5,
      };
      const discountedItems: DiscountedItem[] = [{ productId: 1, quantity: 1, unitPrice: 10, totalPrice: 10 }];

      expect(strategy.shouldApply(discountedItems, promotion)).toBe(true);
    });

    it('should return true when cart total exactly equals minimum order value', () => {
      const promotion: Promotion = {
        id: 4,
        name: '10% off orders over $75',
        type: PromotionType.PercentageDiscount,
        discountValue: 10,
        minimumOrderValue: 75,
      };
      const discountedItems: DiscountedItem[] = [{ productId: 1, quantity: 3, unitPrice: 25, totalPrice: 75 }];

      expect(strategy.shouldApply(discountedItems, promotion)).toBe(true);
    });
  });

  describe('apply', () => {
    it('should apply percentage discount to cart total', () => {
      const promotion: Promotion = {
        id: 5,
        name: '10% off orders over $75',
        type: PromotionType.PercentageDiscount,
        discountValue: 10,
        minimumOrderValue: 75,
      };
      const discountedItems: DiscountedItem[] = [{ productId: 1, quantity: 4, unitPrice: 25, totalPrice: 100 }];

      const result = strategy.apply(discountedItems, promotion);

      expect(result.discountAmount).toBe(10); // 10% of 100
      expect(result.discountedItems).toEqual(discountedItems);
    });

    it('should handle multiple items in cart', () => {
      const promotion: Promotion = {
        id: 6,
        name: '10% off orders over $75',
        type: PromotionType.PercentageDiscount,
        discountValue: 10,
        minimumOrderValue: 75,
      };
      const discountedItems: DiscountedItem[] = [
        { productId: 1, quantity: 2, unitPrice: 30, totalPrice: 60 },
        { productId: 2, quantity: 1, unitPrice: 20, totalPrice: 20 },
      ];

      const result = strategy.apply(discountedItems, promotion);

      expect(result.discountAmount).toBe(8); // 10% of 80
      expect(result.discountedItems).toEqual(discountedItems);
    });

    it('should return zero discount when discount value is not set', () => {
      const promotion: Promotion = {
        id: 7,
        name: '10% off orders over $75',
        type: PromotionType.PercentageDiscount,
        minimumOrderValue: 75,
      };
      const discountedItems: DiscountedItem[] = [{ productId: 1, quantity: 4, unitPrice: 25, totalPrice: 100 }];

      const result = strategy.apply(discountedItems, promotion);

      expect(result.discountAmount).toBe(0);
      expect(result.discountedItems).toEqual(discountedItems);
    });

    it('should handle zero cart total', () => {
      const promotion: Promotion = {
        id: 9,
        name: '10% off orders over $75',
        type: PromotionType.PercentageDiscount,
        discountValue: 10,
        minimumOrderValue: 75,
      };
      const discountedItems: DiscountedItem[] = [];

      const result = strategy.apply(discountedItems, promotion);

      expect(result.discountAmount).toBe(0);
      expect(result.discountedItems).toEqual([]);
    });
  });
});

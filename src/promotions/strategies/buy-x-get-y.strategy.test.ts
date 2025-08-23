import { Promotion, PromotionType } from '../../database/entities/promotion.entity';
import { BuyXGetYStrategy } from './buy-x-get-y.strategy';
import { DiscountedItem } from './promotion-strategy.abstract';

describe('BuyXGetYStrategy', () => {
  let strategy: BuyXGetYStrategy;

  beforeEach(() => {
    strategy = new BuyXGetYStrategy();
  });

  describe('shouldApply', () => {
    it('should return true when target item exists and has sufficient quantity', () => {
      const promotion: Promotion = {
        id: 1,
        name: 'Buy 1 Get 1',
        type: PromotionType.BuyXGetY,
        productId: 1,
        buyCount: 1,
        freeCount: 1,
      };
      const discountedItems: DiscountedItem[] = [{ productId: 1, quantity: 3, unitPrice: 10, totalPrice: 30 }];

      expect(strategy.shouldApply(discountedItems, promotion)).toBe(true);
    });

    it('should return false when target item does not exist', () => {
      const promotion: Promotion = {
        id: 2,
        name: 'Buy 1 Get 1',
        type: PromotionType.BuyXGetY,
        productId: 1,
        buyCount: 1,
        freeCount: 1,
      };
      const discountedItems: DiscountedItem[] = [{ productId: 2, quantity: 5, unitPrice: 10, totalPrice: 50 }];

      expect(strategy.shouldApply(discountedItems, promotion)).toBe(false);
    });

    it('should return false when target item has insufficient quantity', () => {
      const promotion: Promotion = {
        id: 3,
        name: 'Buy 1 Get 1',
        type: PromotionType.BuyXGetY,
        productId: 1,
        buyCount: 1,
        freeCount: 1,
      };
      const discountedItems: DiscountedItem[] = [{ productId: 1, quantity: 1, unitPrice: 10, totalPrice: 10 }];

      expect(strategy.shouldApply(discountedItems, promotion)).toBe(false);
    });
  });

  describe('apply', () => {
    it('should return zero discount when target item is not found', () => {
      const promotion: Promotion = {
        id: 4,
        name: 'Buy 1 Get 1',
        type: PromotionType.BuyXGetY,
        productId: 1,
        buyCount: 1,
        freeCount: 1,
      };
      const discountedItems: DiscountedItem[] = [{ productId: 2, quantity: 5, unitPrice: 10, totalPrice: 50 }];

      const result = strategy.apply(discountedItems, promotion);

      expect(result.discountAmount).toBe(0);
      expect(result.discountedItems).toEqual(discountedItems);
    });

    it('should apply discount for exact promotion set (buy 1 get 1)', () => {
      const promotion: Promotion = {
        id: 5,
        name: 'Buy 1 Get 1',
        type: PromotionType.BuyXGetY,
        productId: 1,
        buyCount: 1,
        freeCount: 1,
      };
      const discountedItems: DiscountedItem[] = [{ productId: 1, quantity: 2, unitPrice: 10, totalPrice: 20 }];

      const result = strategy.apply(discountedItems, promotion);

      expect(result.discountAmount).toBe(10); // 1 free item * 10 unit price
      expect(result.discountedItems[0].totalPrice).toBe(10); // 20 - 10
    });

    it('should apply discount for multiple promotion sets', () => {
      const promotion: Promotion = {
        id: 6,
        name: 'Buy 1 Get 1',
        type: PromotionType.BuyXGetY,
        productId: 1,
        buyCount: 1,
        freeCount: 1,
      };
      const discountedItems: DiscountedItem[] = [{ productId: 1, quantity: 4, unitPrice: 10, totalPrice: 40 }];

      const result = strategy.apply(discountedItems, promotion);

      expect(result.discountAmount).toBe(20); // 2 free items * 10 unit price
      expect(result.discountedItems[0].totalPrice).toBe(20); // 40 - 20
    });

    it('should handle buy 3 get 2 promotion', () => {
      const buyThreeGetTwo: Promotion = {
        id: 8,
        name: 'Buy 3 Get 2',
        type: PromotionType.BuyXGetY,
        productId: 1,
        buyCount: 3,
        freeCount: 2,
      };

      const discountedItems: DiscountedItem[] = [{ productId: 1, quantity: 5, unitPrice: 10, totalPrice: 50 }];

      const result = strategy.apply(discountedItems, buyThreeGetTwo);

      expect(result.discountAmount).toBe(20); // 2 free items * 10 unit price
      expect(result.discountedItems[0].totalPrice).toBe(30); // 50 - 20
    });

    it('should preserve other items in the cart unchanged', () => {
      const promotion: Promotion = {
        id: 10,
        name: 'Buy 1 Get 1',
        type: PromotionType.BuyXGetY,
        productId: 1,
        buyCount: 1,
        freeCount: 1,
      };
      const discountedItems: DiscountedItem[] = [
        { productId: 1, quantity: 2, unitPrice: 10, totalPrice: 20 },
        { productId: 2, quantity: 2, unitPrice: 15, totalPrice: 30 },
      ];

      const result = strategy.apply(discountedItems, promotion);

      expect(result.discountAmount).toBe(10);
      expect(result.discountedItems[0].totalPrice).toBe(10); // target item discounted
      expect(result.discountedItems[1].totalPrice).toBe(30); // other item unchanged
    });
  });
});

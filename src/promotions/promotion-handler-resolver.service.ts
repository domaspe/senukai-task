import { Injectable } from '@nestjs/common';
import { PromotionHandler } from './handlers/promotion-handler.abstract';
import { BuyXGetYHandler } from './handlers/buy-x-get-y.handler';
import { PercentageDiscountHandler } from './handlers/percentage-discount.handler';
import { Promotion, PromotionType, PromotionLevel } from '../database/entities/promotion.entity';

@Injectable()
export class PromotionHandlerResolverService {
  handlers: Record<PromotionType, PromotionHandler>;

  constructor(
    private readonly buyXGetYHandler: BuyXGetYHandler,
    private readonly percentageDiscountHandler: PercentageDiscountHandler,
  ) {
    this.handlers = {
      [PromotionType.BuyXGetY]: buyXGetYHandler,
      [PromotionType.PercentageDiscount]: percentageDiscountHandler,
    };
  }

  getPromotionHandler(promotionType: PromotionType): PromotionHandler {
    return this.handlers[promotionType];
  }

  filterPromotionsByLevel(promotions: Promotion[], level: PromotionLevel): Promotion[] {
    return promotions.filter((promotion) => this.handlers[promotion.type].level === level);
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from '../database/entities/promotion.entity';
import { PromotionHandlerResolverService } from './promotion-handler-resolver.service';
import { PromotionsService } from './promotions.service';
import { BuyXGetYHandler } from './handlers/buy-x-get-y.handler';
import { PercentageDiscountHandler } from './handlers/percentage-discount.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion])],
  providers: [PromotionsService, PromotionHandlerResolverService, BuyXGetYHandler, PercentageDiscountHandler],
  exports: [PromotionsService],
})
export class PromotionsModule {}

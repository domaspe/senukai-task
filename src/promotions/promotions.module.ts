import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from '../database/entities/promotion.entity';
import { PromotionStrategyService } from './promotion-strategy.service';
import { PromotionsService } from './promotions.service';
import { BuyXGetYStrategy } from './strategies/buy-x-get-y.strategy';
import { PercentageDiscountStrategy } from './strategies/percentage-discount.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion])],
  providers: [PromotionsService, PromotionStrategyService, BuyXGetYStrategy, PercentageDiscountStrategy],
  exports: [PromotionsService],
})
export class PromotionsModule {}

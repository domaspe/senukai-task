import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from '../database/entities/promotion.entity';
import { PromotionStrategyService } from './promotion-strategy.service';
import { PromotionsService } from './promotions.service';
import { BuyOneGetOneStrategy } from './strategies/buy-one-get-one.strategy';
import { PercentageDiscountStrategy } from './strategies/percentage-discount.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion])],
  providers: [PromotionsService, PromotionStrategyService, BuyOneGetOneStrategy, PercentageDiscountStrategy],
  exports: [PromotionsService],
})
export class PromotionsModule {}

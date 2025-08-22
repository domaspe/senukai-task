import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../database/entities/product.entity';
import { CartItem } from '../database/entities/cart-item.entity';
import { Cart } from '../database/entities/cart.entity';
import { PromotionsModule } from '../promotions/promotions.module';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Product]), PromotionsModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../database/entities/cart.entity';
import { CartItem } from '../database/entities/cart-item.entity';
import { PromotionsService, PromotionCalculation } from '../promotions/promotions.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Product } from 'src/database/entities/product.entity';
import { roundMoney } from 'src/utils';

export type CartTotal = PromotionCalculation & {
  items: CartItem[];
  subtotal: number;
  total: number;
};

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private promotionsService: PromotionsService,
  ) {}

  async createCart(): Promise<Cart> {
    const cart = this.cartRepository.create();
    return this.cartRepository.save(cart);
  }

  async findCart(cartId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items', 'items.product'],
    });

    if (cart) return cart;

    throw new NotFoundException('Cart not found');
  }

  async addToCart(cartId: number, data: AddToCartDto): Promise<CartItem> {
    const { productId, quantity } = data;

    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const cart = await this.findCart(cartId);

    let cartItem = await this.cartItemRepository.findOne({
      where: { cartId: cart.id, productId },
    });

    if (cartItem) {
      cartItem.quantity = quantity;
      cartItem.totalPrice = cartItem.quantity * cartItem.unitPrice;
    } else {
      cartItem = this.cartItemRepository.create({
        cartId: cart.id,
        productId,
        quantity,
        unitPrice: product.price,
        totalPrice: quantity * product.price,
      });
    }

    return this.cartItemRepository.save(cartItem);
  }

  async updateCartItem(cartId: number, productId: number, data: UpdateCartItemDto): Promise<CartItem | undefined> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { cartId, productId },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (data.quantity === 0) {
      await this.cartItemRepository.delete({ cartId, productId });
      return undefined;
    }

    cartItem.quantity = data.quantity;
    cartItem.totalPrice = cartItem.quantity * cartItem.unitPrice;

    return this.cartItemRepository.save(cartItem);
  }

  async getCartTotal(cartId: number): Promise<CartTotal> {
    const cart = await this.findCart(cartId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const subtotal = roundMoney(cart.items.reduce((sum, item) => sum + item.totalPrice, 0));
    const promotions = await this.promotionsService.calculatePromotions(cart.items);

    return {
      items: cart.items,
      subtotal,
      total: Math.max(subtotal - promotions.discountAmount, 0),
      ...promotions,
    };
  }

  async deleteCart(cartId: number): Promise<void> {
    await this.cartRepository.delete({ id: cartId });
  }
}

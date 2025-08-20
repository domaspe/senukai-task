import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CartItem } from '../database/entities/cart-item.entity';
import { CartService, CartTotal } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':cartId/items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart', type: CartItem })
  async addToCart(@Param('cartId', ParseIntPipe) cartId: number, @Body() body: AddToCartDto): Promise<CartItem> {
    return this.cartService.addToCart(cartId, body);
  }

  @Post(':cartId/items/:productId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiResponse({ status: 200, description: 'Item updated or removed', type: CartItem })
  async updateCartItem(
    @Param('cartId', ParseIntPipe) cartId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() body: UpdateCartItemDto,
  ): Promise<CartItem | { message: string }> {
    const result = await this.cartService.updateCartItem(cartId, productId, body);

    if (!result) {
      return { message: 'Item removed from cart' };
    }

    return result;
  }

  @Get(':cartId')
  @ApiOperation({ summary: 'Get cart total' })
  @ApiResponse({ status: 200, description: 'Cart total and items', type: Object })
  async getCartTotal(@Param('cartId', ParseIntPipe) cartId: number): Promise<CartTotal> {
    return this.cartService.getCartTotal(cartId);
  }

  @Delete(':cartId')
  @ApiOperation({ summary: 'Delete cart' })
  @ApiResponse({ status: 200, description: 'Cart deleted', type: Object })
  async deleteCart(@Param('cartId', ParseIntPipe) cartId: number): Promise<{ message: string }> {
    await this.cartService.deleteCart(cartId);
    return { message: 'Cart deleted' };
  }

  @Post()
  @ApiOperation({ summary: 'Create cart' })
  async createCart() {
    return this.cartService.createCart();
  }
}

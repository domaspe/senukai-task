import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum PromotionType {
  BuyOneGetOne = 'BuyOneGetOne',
  PercentageDiscount = 'PercentageDiscount',
}

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({
    type: 'varchar',
    enum: PromotionType,
  })
  type: PromotionType;

  @Column({ type: 'int', nullable: true })
  productId?: number;

  @Column({ type: 'int', nullable: true })
  discountValue?: number;

  @Column({ type: 'int', nullable: true })
  minimumOrderValue?: number;
}

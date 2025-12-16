import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from './user.model';

@Table({
    tableName: "subscriptions",
    timestamps: true,
    underscored: true
})
export class Subscription extends Model<Subscription> {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    })
    id: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'user_id'
    })
    userId: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
        field: 'stripe_customer_id'
    })
    stripeCustomerId: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
        field: 'stripe_subscription_id'
    })
    stripeSubscriptionId: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
        field: 'stripe_price_id'
    })
    stripePriceId: string;

    @Column({
        type: DataType.ENUM('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid'),
        allowNull: false,
        defaultValue: 'incomplete'
    })
    status: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'current_period_start'
    })
    currentPeriodStart: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'current_period_end'
    })
    currentPeriodEnd: Date;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
        field: 'cancel_at_period_end'
    })
    cancelAtPeriodEnd: boolean;

    @Column({
        type: DataType.DATE,
        allowNull: true,
        field: 'canceled_at'
    })
    canceledAt: Date;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    price: number;

    @Column({
        type: DataType.STRING(3),
        allowNull: false,
        defaultValue: 'BRL'
    })
    currency: string;

    @Column({
        type: DataType.ENUM('mensal', 'trimestral', 'semestral', 'anual'),
        allowNull: false,
        field: 'plan_type'
    })
    planType: string; // mensal, trimestral, semestral, anual

    @BelongsTo(() => User)
    user: User;

    @Column({ field: 'created_at' })
    createdAt: Date;

    @Column({ field: 'updated_at' })
    updatedAt: Date;
}
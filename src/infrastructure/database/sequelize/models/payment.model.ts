import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from './user.model';

@Table({
    tableName: "payments",
    timestamps: true,
    underscored: true
})
export class Payment extends Model<Payment> {
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
        field: 'stripe_payment_intent_id'
    })
    stripePaymentIntentId: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: true,
        field: 'stripe_charge_id'
    })
    stripeChargeId: string;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    amount: number;

    @Column({
        type: DataType.STRING(3),
        allowNull: false,
        defaultValue: 'BRL'
    })
    currency: string;

    @Column({
        type: DataType.ENUM('pending', 'processing', 'succeeded', 'failed', 'canceled', 'requires_action'),
        allowNull: false,
        defaultValue: 'pending'
    })
    status: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
        field: 'payment_method'
    })
    paymentMethod: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
        field: 'failure_reason'
    })
    failureReason: string;

    @Column({
        type: DataType.JSONB,
        allowNull: true,
        field: 'metadata'
    })
    metadata: object;

    @Column({
        type: DataType.DATE,
        allowNull: true,
        field: 'paid_at'
    })
    paidAt: Date;

    @BelongsTo(() => User)
    user: User;

    @Column({ field: 'created_at' })
    createdAt: Date;

    @Column({ field: 'updated_at' })
    updatedAt: Date;
}
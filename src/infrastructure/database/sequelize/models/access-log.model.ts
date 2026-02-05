import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';

@Table({
    tableName: 'access_logs',
    timestamps: true,
    underscored: true
})
export class AccessLog extends Model<AccessLog> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true
    })
    id: string;

    @Column({
        type: DataType.STRING(500),
        allowNull: false,
    })
    route: string;

    @Column({
        type: DataType.STRING(10),
        allowNull: false,
    })
    method: string;

    @Column({
        type: DataType.STRING(45),
        allowNull: false,
    })
    ip: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
        field: 'user_agent'
    })
    userAgent: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
        field: 'user_id'
    })
    userId: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
    })
    timestamp: Date;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        field: 'status_code'
    })
    statusCode: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        field: 'response_time'
    })
    responseTime: number;

    @Column({
        type: DataType.ENUM('page_view', 'login', 'api_call', 'other'),
        allowNull: false,
        defaultValue: 'other',
        field: 'action_type'
    })
    actionType: string;

    @BelongsTo(() => User)
    user: User;

    @Column({ field: 'created_at' })
    createdAt: Date;

    @Column({ field: 'updated_at' })
    updatedAt: Date;
}

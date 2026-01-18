import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';

@Table({
    tableName: "notifications",
    timestamps: true,
    underscored: true
})
export class Notification extends Model<Notification> {
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
        field: 'usuario_id'
    })
    usuario_id: number;

    @Column({
        type: DataType.STRING(200),
        allowNull: false,
    })
    title: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    message: string;

    @Column({
        type: DataType.STRING(500),
        allowNull: true,
    })
    image: string | null;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
        defaultValue: 'Sistema'
    })
    author: string;

    @Column({
        type: DataType.STRING(20),
        allowNull: false,
        defaultValue: 'info',
        validate: {
            isIn: [['info', 'success', 'warning', 'error', 'system']]
        }
    })
    type: string;

    @Column({
        type: DataType.STRING(7),
        allowNull: false,
        defaultValue: '#00d2ff',
        field: 'tag_color'
    })
    tag_color: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    read: boolean;

    @Column({ field: 'created_at' })
    createdAt: Date;

    @Column({ field: 'updated_at' })
    updatedAt: Date;

    @BelongsTo(() => User)
    user: User;
}

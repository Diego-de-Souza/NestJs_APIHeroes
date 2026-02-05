import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName: "news",
    timestamps: false
})
export class News extends Model<News> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true
    })
    id: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    title: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    description: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    image: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    link: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    category: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    date: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
        field: 'read_time'
    })
    read_time: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
        defaultValue: 'Sistema'
    })
    author: string;

    @Column({
        type: DataType.UUID,
        allowNull: true,
        field: 'usuario_id'
    })
    usuario_id: string;

    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
        allowNull: false,
    })
    created_at: string;

    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
        allowNull: false,
    })
    updated_at: string;
}

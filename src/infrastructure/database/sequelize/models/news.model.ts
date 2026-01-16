import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName: "news",
    timestamps: false
})
export class News extends Model<News> {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    })
    id: number;

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
        type: DataType.TEXT,
        allowNull: false,
    })
    content: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
        field: 'type_news_letter'
    })
    type_news_letter: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    theme: string;

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

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    })
    views: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        field: 'usuario_id'
    })
    usuario_id: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        defaultValue: 3,
        field: 'role_art',
        comment: '1:root, 2:admin, 3:client'
    })
    role_art: number;
}

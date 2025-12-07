import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName: "articles",
    timestamps: false
})
export class Article extends Model<Article> {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    })
    id: number;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    category: string;

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
    text: string;

    @Column({
        type: DataType.JSONB,
        allowNull: false,
    })
    summary: object;

    @Column({
        type: DataType.STRING(255),
    })
    thumbnail: string;

    @Column({
        type: DataType.ARRAY(DataType.TEXT),
        allowNull: false,
        field: 'key_words'
    })
    keyWords: string[];

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    route: string;

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
        type: DataType.STRING(50),
    })
    theme: string;

    @Column({
        type: DataType.STRING(20),
        field: 'theme_color'
    })
    themeColor: string;

    @Column({
        type: DataType.STRING(255),
    })
    image: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    author: string;
}
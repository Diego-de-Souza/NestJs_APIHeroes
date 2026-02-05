import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from './user.model';

@Table({
    tableName: "articles",
    timestamps: false
})
export class Article extends Model<Article> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true
    })
    id: string;

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
        allowNull: true,
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
        type: DataType.STRING(255),
    })
    image_source: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    author: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: true,
        field: 'usuario_id'
    })
    usuario_id: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        defaultValue: 3,
        field: 'role_art',
        comment: '1:root, 2:admin, 3:client'
    })
    role_art: number;
}
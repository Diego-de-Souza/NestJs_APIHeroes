import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName:"games",
    timestamps:false
})
export class Games extends Model<Games>{
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
        allowNull:false,
    })
    name:string;

    @Column({
        type: DataType.STRING(255),
        allowNull:false,
    })
    description:string;

    @Column({
        type: DataType.STRING(50),
        allowNull:false,
    })
    type:string;

    @Column({
        type: DataType.STRING(255),
        allowNull:false,
    })
    link:string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    url_icon: string;

}

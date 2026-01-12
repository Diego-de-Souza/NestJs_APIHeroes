import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName:"games",
    timestamps:false
})
export class Games extends Model<Games>{
    @Column({
        type: DataType.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
        unique:true
    })
    id:number;

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

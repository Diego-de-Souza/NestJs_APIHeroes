import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName:"events",
    timestamps:false
})
export class Events extends Model<Events>{
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
    title:string;

    @Column({
        type: DataType.STRING(100),
        allowNull:false,
    })
    description:string;

    @Column({
        type: DataType.STRING(100),
        allowNull: true,
    })
    location:string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    date_event:string;

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
    })
    url_event:string;

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
    })
    url_image:string;

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

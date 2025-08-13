import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName:"user_game_progress",
    timestamps:false
})
export class UserGameProgress extends Model<UserGameProgress>{
    @Column({
        type: DataType.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
        unique:true
    })
    id:number;

    @Column({
        type: DataType.INTEGER,
        allowNull:false,
    })
    user_id:number;

    @Column({
        type: DataType.INTEGER,
        allowNull:false,
    })
    game_id:number;

    @Column({
        type: DataType.SMALLINT,
        allowNull:false,
    })
    lvl_user:number;

    @Column({
        type: DataType.INTEGER,
        allowNull:false,
    })
    score:number;

    @Column({
        type: DataType.SMALLINT,
    })
    attempts: number;

    @Column({
        type: DataType.DATE,
        allowNull:false,
    })
    last_move_at: Date;

    @Column({
        type: DataType.JSON,
        allowNull:true,
    })
    metadata: any;

}

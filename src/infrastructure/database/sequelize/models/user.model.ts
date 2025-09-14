import { Column, DataType, Table,Model, Sequelize } from "sequelize-typescript";


@Table({
    tableName : "users",
    timestamps: false,

})
export class User extends Model<User>{
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  id: number;

    @Column({ 
        type: DataType.STRING(100),
        unique: true,
        allowNull: false,
    })
    fullname : string;

    @Column({ 
        type: DataType.STRING(100),
        unique: true,
        allowNull: false,
    })
    nickname  : string;

    @Column({ 
        type: DataType.DATEONLY,

    })
    birthdate   : Date;

    @Column({ 
        type: DataType.STRING(100),
        unique: true,
        allowNull: false,
    })
    firstemail : string;

    @Column({ 
        type: DataType.STRING(100),
        unique: true,
        allowNull: true,
    })
    secondemail : string;

    @Column({ 
        type: DataType.STRING(3),
        unique: true,
        allowNull: true,
    })
    uf  : string;

    @Column({ 
        type: DataType.STRING(100),
        unique: true,
        allowNull: true,
    })
    address   : string;

    @Column({ 
        type: DataType.STRING(100),
        unique: true,
        allowNull: true,
    })
    complement : string;

    @Column({ 
        type: DataType.STRING(9),
        unique: true,
        allowNull: true,
    })
    cep  : string;

    @Column({ 
        type: DataType.STRING(50),
        unique: true,
        allowNull: true,
    })
    state   : string;

    @Column({ 
        type: DataType.STRING(100),
        unique: true,
        allowNull: true,
    })
    city   : string;

    @Column({ 
        type: DataType.STRING(100),
        allowNull: false,
    })
    password: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
    })
    totp_secret: string;
    
    @Column({
        type: DataType.STRING(255),
        allowNull: true,
    })
    mfa_secret: string;

    @Column({
        type: DataType.DATE,
    })
    created_at: Date;
    
    @Column({
        type: DataType.DATE,
        defaultValue: Sequelize.fn('NOW') 
    })
    updated_at: Date;
}
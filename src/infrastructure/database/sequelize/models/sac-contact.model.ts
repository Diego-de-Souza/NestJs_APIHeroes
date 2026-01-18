import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { User } from './user.model';
import { SacResponse } from './sac-response.model';
import { SacAttachment } from './sac-attachment.model';

@Table({
    tableName: "sac_contacts",
    timestamps: true,
    underscored: true
})
export class SacContact extends Model<SacContact> {
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
        type: DataType.STRING(20),
        allowNull: false,
        unique: true,
        field: 'ticket_number'
    })
    ticket_number: string;

    @Column({
        type: DataType.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['suporte', 'reclamacao', 'elogio']]
        }
    })
    type: string;

    @Column({
        type: DataType.STRING(200),
        allowNull: false,
    })
    subject: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    message: string;

    @Column({
        type: DataType.STRING(20),
        allowNull: false,
        defaultValue: 'normal',
        validate: {
            isIn: [['low', 'normal', 'high', 'urgent']]
        }
    })
    priority: string;

    @Column({
        type: DataType.STRING(20),
        allowNull: false,
        defaultValue: 'aberto',
        validate: {
            isIn: [['aberto', 'em_andamento', 'resolvido', 'fechado']]
        }
    })
    status: string;

    @Column({ field: 'created_at' })
    createdAt: Date;

    @Column({ field: 'updated_at' })
    updatedAt: Date;

    @BelongsTo(() => User)
    user: User;

    @HasMany(() => SacResponse)
    responses: SacResponse[];

    @HasMany(() => SacAttachment)
    attachments: SacAttachment[];
}

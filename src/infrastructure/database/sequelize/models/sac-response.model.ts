import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { SacContact } from './sac-contact.model';
import { SacAttachment } from './sac-attachment.model';

@Table({
    tableName: "sac_responses",
    timestamps: false,
    underscored: true
})
export class SacResponse extends Model<SacResponse> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true
    })
    id: string;

    @ForeignKey(() => SacContact)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        field: 'contact_id'
    })
    contact_id: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    message: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
        defaultValue: 'Sistema'
    })
    author: string;

    @Column({ 
        type: DataType.DATE,
        defaultValue: DataType.NOW,
        allowNull: false,
        field: 'created_at'
    })
    createdAt: Date;

    @BelongsTo(() => SacContact)
    contact: SacContact;

    @HasMany(() => SacAttachment)
    attachments: SacAttachment[];
}

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { SacContact } from './sac-contact.model';
import { SacResponse } from './sac-response.model';

@Table({
    tableName: "sac_attachments",
    timestamps: false,
    underscored: true
})
export class SacAttachment extends Model<SacAttachment> {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    })
    id: number;

    @ForeignKey(() => SacContact)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        field: 'contact_id'
    })
    contact_id: number | null;

    @ForeignKey(() => SacResponse)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        field: 'response_id'
    })
    response_id: number | null;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        field: 'file_name'
    })
    file_name: string;

    @Column({
        type: DataType.STRING(500),
        allowNull: false,
        field: 'file_path'
    })
    file_path: string;

    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        field: 'file_size'
    })
    file_size: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
        field: 'mime_type'
    })
    mime_type: string;

    @Column({ 
        type: DataType.DATE,
        defaultValue: DataType.NOW,
        allowNull: false,
        field: 'created_at'
    })
    createdAt: Date;

    @BelongsTo(() => SacContact)
    contact: SacContact;

    @BelongsTo(() => SacResponse)
    response: SacResponse;
}

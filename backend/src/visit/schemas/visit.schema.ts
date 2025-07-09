import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { VisitType } from '../enums/visit-type.enum';

export type VisitDocument = HydratedDocument<Visit>;

@Schema({
    timestamps: {
        createdAt: 'dateCreated',
        updatedAt: 'dateUpdated'
    }
})
export class Visit {
    @Prop({
        type: Types.ObjectId,
        required: true,
        ref: 'Patient'
    })
    patientId: Types.ObjectId

    @Prop({
        required: true
    })
    visitDate: Date

    @Prop()
    notes: String

    @Prop({
        type: String,
        required: true,
        enum: VisitType
    })
    visitType: VisitType

    @Prop()
    dateCreated?: Date;

    @Prop()
    dateUpdated?: Date;

}

export const VisitSchema = SchemaFactory.createForClass(Visit);

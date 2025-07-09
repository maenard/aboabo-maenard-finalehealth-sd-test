import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PatientDocument = HydratedDocument<Patient>;

@Schema({
    timestamps: {
        createdAt: 'dateCreated',
        updatedAt: 'dateUpdated'
    }
})
export class Patient {
    @Prop({
        required: true,
        trim: true
    })
    firstName: string;

    @Prop({
        required: true,
        trim: true
    })
    lastName: string;

    @Prop({
        required: true,
        trim: true
    })
    dob: Date;

    @Prop({
        required: true,
        trim: true
    })
    email: String;

    @Prop({
        required: true,
        trim: true
    })
    phoneNumber: String;

    @Prop({
        required: true,
        trim: true
    })
    address: String;

    @Prop()
    dateCreated?: Date;

    @Prop()
    dateUpdated?: Date;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);

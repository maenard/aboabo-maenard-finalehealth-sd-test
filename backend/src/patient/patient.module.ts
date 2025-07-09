import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from './schemas/patient.schema';
import { VisitModule } from 'src/visit/visit.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
    VisitModule
  ],
  exports: [MongooseModule],
  controllers: [PatientController],
  providers: [PatientService]
})
export class PatientModule { }

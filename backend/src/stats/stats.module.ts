import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from 'src/patient/schemas/patient.schema';
import { Visit, VisitSchema } from 'src/visit/schemas/visit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Patient.name, schema: PatientSchema },
      { name: Visit.name, schema: VisitSchema },
    ])
  ],
  controllers: [StatsController],
  providers: [StatsService]
})
export class StatsModule { }

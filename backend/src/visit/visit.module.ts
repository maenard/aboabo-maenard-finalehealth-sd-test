import { forwardRef, Module } from '@nestjs/common';
import { VisitController } from './visit.controller';
import { VisitService } from './visit.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Visit, VisitSchema } from './schemas/visit.schema';
import { PatientModule } from 'src/patient/patient.module';

@Module({
  imports: [MongooseModule.forFeature([{
    name: Visit.name,
    schema: VisitSchema
  }]),
  forwardRef(() => PatientModule)
  ],
  controllers: [VisitController],
  providers: [VisitService],
  exports: [VisitService]
})
export class VisitModule { }

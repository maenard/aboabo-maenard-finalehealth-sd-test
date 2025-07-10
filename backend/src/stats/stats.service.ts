import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient, PatientDocument } from 'src/patient/schemas/patient.schema';
import { Visit, VisitDocument } from 'src/visit/schemas/visit.schema';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Visit.name) private visitModel: Model<VisitDocument>,
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
  ) { }

  async getStats() {
    const totalPatients = await this.patientModel.countDocuments();

    const totalVisits = await this.visitModel.countDocuments();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const totalVisitsToday = await this.visitModel.countDocuments({
      visitDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })

    return {
      totalPatients,
      totalVisitsToday,
      totalVisits,
    }

  }
}

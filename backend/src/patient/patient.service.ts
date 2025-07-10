import { Injectable, NotFoundException } from '@nestjs/common';
import { Patient, PatientDocument } from './schemas/patient.schema';
import { Model, PipelineStage } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>
  ) { }

  async create(dto: CreatePatientDto): Promise<Patient> {
    return this.patientModel.create(dto)
  }

  async findAll(query: PaginationQueryDto): Promise<any> {
    const {
      search = '',
      page = 1,
      limit = 5,
      sortBy = 'dateCreated',
      sortOrder = 'desc',
    } = query

    const skip = (Number(page) - 1) * Number(limit);

    const countPipeline: PipelineStage[] = [
      ...(search
        ? [{
          $match: {
            $or: [
              { firstName: { $regex: search, $options: 'i' } },
              { lastName: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } },
              { phoneNumber: { $regex: search, $options: 'i' } },
              { address: { $regex: search, $options: 'i' } }
            ]
          }
        }]
        : []),
      { $count: 'total' }
    ];

    const totalResult = await this.patientModel.aggregate(countPipeline).exec();
    const totalItems = totalResult[0]?.total || 0;
    const totalPages = Math.ceil(totalItems / Number(limit));

    const data = await this.patientModel.aggregate([
      {
        $lookup: {
          from: 'visits',
          localField: '_id',
          foreignField: 'patientId',
          as: 'visits'
        }
      },
      {
        $addFields: {
          totalVisits: { $size: '$visits' }
        }
      },
      ...(search
        ? [{
          $match: {
            $or: [
              { firstName: { $regex: search, $options: 'i' } },
              { lastName: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } },
              { phoneNumber: { $regex: search, $options: 'i' } },
              { address: { $regex: search, $options: 'i' } }
            ]
          }
        }]
        : []),
      { $project: { visits: 0 } },
      { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
      { $skip: skip },
      { $limit: Number(limit) }
    ]).exec();

    return {
      data,
      meta: {
        currentPage: Number(page),
        totalPages,
        totalItems,
        perPage: Number(limit),
      },
      query
    }
  }

  async update(id: String, dto: UpdatePatientDto): Promise<Patient> {
    const updated = await this.patientModel.findByIdAndUpdate(id, dto, { new: true }).exec()
    if (!updated) throw new NotFoundException('Patient not found!')
    return updated
  }

  async delete(id: String): Promise<void> {
    const res = await this.patientModel.findByIdAndDelete(id).exec()

    if (!res) throw new NotFoundException('Patient not found!')
  }

}

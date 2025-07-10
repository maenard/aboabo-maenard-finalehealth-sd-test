import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { Visit, VisitDocument } from './schemas/visit.schema';
import { CreateVisitDto } from './dtos/create-visit.dto';
import { UpdateVisitDto } from './dtos/update-visit.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { buildPageUrl } from 'src/common/helpers/pagination.helper';
import { Patient, PatientDocument } from 'src/patient/schemas/patient.schema';

@Injectable()
export class VisitService {
  constructor(
    @InjectModel(Visit.name) private visitModel: Model<VisitDocument>,
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>
  ) { }

  async findAll(): Promise<Visit[]> {
    return this.visitModel.find().exec()
  }

  async findByPatientid(patientId: string, query: PaginationQueryDto = {}): Promise<any> {

    const baseUrl = `/patients/${patientId}/visits`
    const {
      search = '',
      page = 1,
      limit = 10,
      sortBy = 'visitDate',
      sortOrder = 'desc',
    } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const patient = await this.patientModel.findById(patientId).lean();

    const matchStage: PipelineStage.Match = {
      $match: {
        patientId: new Types.ObjectId(patientId),
        ...(search && {
          $or: [
            { visitType: { $regex: search, $options: 'i' } },
            { types: { $regex: search, $options: 'i' } },
            { notes: { $regex: search, $options: 'i' } }
          ]
        })
      }
    };

    const countPipeline: PipelineStage[] = [
      matchStage,
      { $count: 'total' }
    ];

    const totalResult = await this.visitModel.aggregate(countPipeline).exec();
    const totalItems = totalResult[0]?.total || 0;
    const totalPages = Math.ceil(totalItems / Number(limit));

    const dataPipeline: PipelineStage[] = [
      matchStage,
      {
        $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 }
      },
      {
        $skip: skip
      },
      {
        $limit: Number(limit)
      }
    ];

    const data = await this.visitModel.aggregate(dataPipeline).exec();

    return {
      data: {
        patient: patient,
        visits: data,
      },
      meta: {
        currentPage: Number(page),
        totalPages,
        totalItems,
        perPage: Number(limit),
        nextPage: Number(page) < totalPages
          ? buildPageUrl(baseUrl, { search, limit, sortBy, sortOrder }, Number(page) + 1)
          : null,
        prevPage: Number(page) > 1
          ? buildPageUrl(baseUrl, { search, limit, sortBy, sortOrder }, Number(page) - 1)
          : null,
      }
    };
  }

  async create(id: string, dto: CreateVisitDto): Promise<Visit> {
    return this.visitModel.create({ ...dto, patientId: new Types.ObjectId(id) })
  }

  async update(id: string, dto: UpdateVisitDto): Promise<Visit> {
    const updated = await this.visitModel.findByIdAndUpdate(id, dto, { new: true }).exec()

    if (!updated) throw new NotFoundException('Patient not found!')

    return updated
  }

  async delete(id: string): Promise<void> {
    const res = await this.visitModel.findByIdAndDelete(id).exec()

    if (!res) throw new NotFoundException('Visit not found!')
  }

}

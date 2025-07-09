import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { VisitService } from 'src/visit/visit.service';
import { CreateVisitDto } from 'src/visit/dtos/create-visit.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('patient')
export class PatientController {
    constructor(
        private readonly patientService: PatientService,
        private readonly visitService: VisitService
    ) { }

    // POST: /patients
    @Post()
    create(@Body() dto: CreatePatientDto) {
        return this.patientService.create(dto)
    }

    // GET: /patients
    @Get()
    findAll(@Query() query: PaginationQueryDto) {
        return this.patientService.findAll(query)
    }

    // PUT: /patients/:id
    @Put(':id')
    update(@Param('id') id: String, @Body() dto: UpdatePatientDto) {
        return this.patientService.update(id, dto)
    }

    // DELETE: /patients/:id
    @Delete(':id')
    delete(@Param('id') id: String) {
        return this.patientService.delete(id)
    }

    // GET: /patients/:id/visits
    @Get(':id/visits')
    findVisitsByPatientId(@Param('id') id: string, @Query() query: PaginationQueryDto) {
        return this.visitService.findByPatientid(id, query)
    }

    // POST: /patients/:id/visits
    @Post(':id/visits')
    createVisit(@Param('id') id: string, @Body() dto: CreateVisitDto) {
        return this.visitService.create(id, dto)
    }
}

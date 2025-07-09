import { Body, Controller, Delete, Param, Put } from '@nestjs/common';
import { VisitService } from './visit.service';
import { CreateVisitDto } from './dtos/create-visit.dto';

@Controller('visit')
export class VisitController {
  constructor(
    private readonly visitService: VisitService
  ) { }

  // PUT: /visit/:id
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: CreateVisitDto) {
    return this.visitService.update(id, dto)
  }

  // DELETE: /visit/:id
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.visitService.delete(id)
  }
}

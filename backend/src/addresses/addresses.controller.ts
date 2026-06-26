import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Req, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.addressesService.findByUser(req.user.id);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateAddressDto) {
    return this.addressesService.create(req.user.id, dto);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: Partial<CreateAddressDto>) {
    return this.addressesService.update(id, req.user.id, dto);
  }

  @Patch(':id/default')
  setDefault(@Req() req: any, @Param('id') id: string) {
    return this.addressesService.setDefault(id, req.user.id);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.addressesService.remove(id, req.user.id);
  }
}

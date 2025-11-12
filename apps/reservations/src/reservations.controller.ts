import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import {
  CommonJwtAuthGuard,
  CurrentUser,
  PaymentSuccessEvent,
  UserDto,
} from '@app/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UseGuards(CommonJwtAuthGuard)
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() user: UserDto,
  ) {
    const data = await this.reservationsService.create(
      createReservationDto,
      user._id,
      user.email,
    );
    return { message: 'Reservation created successfully', data };
  }

  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne({ id });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }

  @EventPattern('payment.success')
  async completeReservation(@Payload() data: PaymentSuccessEvent) {
    await this.reservationsService.completeReservation(data);
  }
}

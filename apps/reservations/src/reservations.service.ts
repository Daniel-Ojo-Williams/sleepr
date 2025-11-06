import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';

@Injectable()
export class ReservationsService {
  constructor(private readonly repository: ReservationsRepository) {}

  create(createReservationDto: CreateReservationDto, userId: string) {
    return this.repository.create({
      ...createReservationDto,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  findAll() {
    return this.repository.find({});
  }

  findOne(id: string) {
    return this.repository.findOne({ _id: id });
  }

  update(id: string, updateReservationDto: UpdateReservationDto) {
    return this.repository.findOneAndUpdate(
      { _id: id },
      { $set: updateReservationDto, updatedAt: new Date() },
    );
  }

  remove(id: string) {
    return this.repository.findOneAndDelete({ _id: id });
  }
}

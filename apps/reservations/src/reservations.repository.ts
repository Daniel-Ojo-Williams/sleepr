import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { Model } from 'mongoose';
import { ReservationDocument } from './models/reservation.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ReservationsRepository extends AbstractRepository<ReservationDocument> {
  constructor(
    @InjectModel(ReservationDocument.name)
    model: Model<ReservationDocument>,
  ) {
    super(model);
  }
}

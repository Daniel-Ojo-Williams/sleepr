import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { ClientProxy } from '@nestjs/microservices';
import { PAYMENTS_SERVICE } from '@app/common/constants';
import { addMinutes } from 'date-fns';
import { lastValueFrom } from 'rxjs';
import { CreatePaymentDto, PaymentResponse } from '@app/common';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly repository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsClient: ClientProxy,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    userId: string,
    email: string,
  ) {
    try {
      const paymentResponse = await lastValueFrom(
        this.paymentsClient.send<PaymentResponse, CreatePaymentDto>(
          'create_payment',
          {
            email,
            amount: createReservationDto.amount,
            expiration: addMinutes(new Date(), 1),
          },
        ),
      );

      await this.repository.create({
        ...createReservationDto,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        invoiceId: paymentResponse.refrence,
      });

      return paymentResponse;
    } catch (error) {
      console.log(error, 'Some error herereerere');
      throw error;
    }
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

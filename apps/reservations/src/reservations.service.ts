import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { ClientProxy } from '@nestjs/microservices';
import {
  PAYMENTS_SERVICE,
  AUTH_SECVICE,
  UserDto,
  EVENT_BUS,
  ReservationCreatedMailDto,
} from '@app/common';
import { addMinutes } from 'date-fns';
import { catchError, lastValueFrom } from 'rxjs';
import {
  CreatePaymentDto,
  PaymentResponse,
  PaymentSuccessEvent,
} from '@app/common';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly repository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsClient: ClientProxy,
    @Inject(AUTH_SECVICE) private readonly authClient: ClientProxy,
    @Inject(EVENT_BUS) private readonly eventBus: ClientProxy,
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
        invoiceId: paymentResponse.reference,
        status: 'pending',
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

  findOne({ id, invoiceId }: { id?: string; invoiceId?: string }) {
    return this.repository.findOne({ _id: id, invoiceId });
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

  async completeReservation(data: PaymentSuccessEvent) {
    const reservation = await this.repository.findOne({
      invoiceId: data.reference,
    });

    if (!reservation) return;

    if (reservation.status !== 'paid')
      await this.update(reservation._id.toString(), { status: 'paid' });

    const user = await lastValueFrom(
      this.authClient.send<UserDto, { id: string }>('find_user', {
        id: reservation.userId,
      }),
    ).catch((error) => {
      console.log(error, 'Error fetching user'); // TODO: Add logger here
      throw error;
    });

    this.eventBus
      .emit<string, ReservationCreatedMailDto>(
        'notifications.reservation.created',
        {
          toName: user.name,
          toEmail: user.email,
        },
      )
      .pipe(
        catchError((err) => {
          console.log(err, 'Error sending notifications');
          throw err;
        }),
      );
  }
}

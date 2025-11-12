import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

@Schema({ versionKey: false })
export class ReservationDocument extends AbstractDocument {
  @Prop({ type: SchemaTypes.Date })
  startDate: Date;

  @Prop({ type: SchemaTypes.Date })
  endDate: Date;

  @Prop({ required: true })
  userId: string;

  @Prop()
  placeId: string;

  @Prop()
  invoiceId: string;

  @Prop({ default: 'pending' })
  status: string;
}

export const ReservationSchema =
  SchemaFactory.createForClass(ReservationDocument);

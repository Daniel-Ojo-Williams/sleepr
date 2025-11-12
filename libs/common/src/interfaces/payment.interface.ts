export interface PaymentResponse {
  reference: string;
  authorizationUrl: string;
}

export interface PaymentSuccessEvent {
  reference: string;
  amount: number;
  type: 'reservation';
}

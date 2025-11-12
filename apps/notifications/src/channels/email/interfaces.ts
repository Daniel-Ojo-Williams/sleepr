import { JSX } from 'react';

export interface ReservationCreatedParams {
  name: string;
}

export interface TemplateParamsMap {
  ReservationCreated: ReservationCreatedParams;
}

export type TemplateName = keyof TemplateParamsMap;
export type TemplateParams = TemplateParamsMap[TemplateName];

export interface EmailPayload<T extends TemplateName = TemplateName> {
  template: T;
  options: TemplateParamsMap[T];
  subject: string;
  fromEmail: string;
  toEmail: string;
  fromName?: string;
  toName?: string;
}
export type EmailComponent<T extends TemplateName> = (
  props: TemplateParamsMap[T],
) => JSX.Element;

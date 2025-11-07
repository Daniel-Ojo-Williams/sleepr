import { Injectable } from '@nestjs/common';
import { request } from 'undici';
import { HttpError } from './errors';
import {
  HttpRequestOptions,
  HttpResponse,
  PostRequestOptions,
} from './interfaces';

@Injectable()
export class HttpService {
  private readonly httpRequest = request;

  post = async <TPayload = unknown, TResponse = unknown>(
    options: PostRequestOptions<TPayload>,
  ): Promise<HttpResponse<TResponse>> => {
    let responseBody: TResponse;
    try {
      const { body, statusCode } = await this.httpRequest(options.url, {
        method: 'POST',
        headers: options.headers,
        body: JSON.stringify(options.payload),
      });

      responseBody = (await body.json()) as TResponse;

      if (statusCode >= 400) {
        throw new HttpError(
          `HTTP request failed with status ${statusCode}`,
          statusCode,
          options.url,
          responseBody,
          options.payload,
        );
      }

      return {
        body: responseBody,
        statusCode,
      };
    } catch (error) {
      if (error instanceof HttpError) throw error;

      throw new HttpError(
        `Network error: ${(error as Error).message}`,
        0,
        options.url,
        options.payload,
      );
    }
  };

  get = async <TResponse = unknown>(
    options: HttpRequestOptions,
  ): Promise<HttpResponse<TResponse>> => {
    let responseBody: TResponse;
    try {
      const { body, statusCode } = await this.httpRequest(options.url, {
        method: 'GET',
        headers: options.headers,
        query: options.query,
      });

      responseBody = (await body.json()) as TResponse;

      if (statusCode >= 400) {
        throw new HttpError(
          `HTTP request failed with status ${statusCode}`,
          statusCode,
          options.url,
          responseBody,
        );
      }

      return {
        body: responseBody,
        statusCode,
      };
    } catch (error) {
      if (error instanceof HttpError) throw error;

      throw new HttpError(
        `Network error: ${(error as Error).message}`,
        0,
        options.url,
      );
    }
  };
}

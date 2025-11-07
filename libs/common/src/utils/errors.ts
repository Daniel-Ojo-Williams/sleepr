export class HttpError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public url: string,
    public responseBody?: unknown,
    public requestPayload?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
    Error.captureStackTrace(this, this.constructor);
  }
}

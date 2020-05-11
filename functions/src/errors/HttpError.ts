export class HttpError extends Error {
  name = "HttpError";
  constructor(public code: number, message: string) {
    super(message);
  }
}

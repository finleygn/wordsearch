import HTTPError from './HTTPError.ts';

class InternalServerError extends HTTPError {
  name = "InternalServerError";

  constructor(message: string = "Something went wrong") {
    super(500, message);
  }
}

export default InternalServerError;
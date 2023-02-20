import HTTPError from './HTTPError.ts';

class BadRequest extends HTTPError {
  name = "BadRequest";

  constructor(message: string = "Invalid request") {
    super(400, message);
  }
}

export default BadRequest;
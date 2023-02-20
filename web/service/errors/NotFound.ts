import HTTPError from './HTTPError.ts';

class NotFoundError extends HTTPError {
  name = "NotFound";

  constructor(message: string = "Not found") {
    super(404, message);
  }
}

export default NotFoundError;
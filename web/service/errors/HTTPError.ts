class HTTPError extends Error {
  public readonly name: string = "HttpError";

  constructor(
    public readonly status: number,
    public readonly message: string,
  ) {
    super(message);
    this.status = status;
  }
}

export default HTTPError;
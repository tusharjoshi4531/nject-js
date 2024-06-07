export class ServerError extends Error {
  private status: number;
  private responseBody: any;

  constructor(
    status: number,
    responseBody: any,
    message: string = "ServerError"
  ) {
    super(message);
    this.status = status;
    this.responseBody = responseBody;
  }

  public get isError() {
    const chr = this.status.toString()[0];
    return ["4", "5"].find((val) => val == chr);
  }

  public get ResBody() {
    return this.responseBody;
  }
}

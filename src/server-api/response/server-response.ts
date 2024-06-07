import { HttpStatusCode } from "../../common/http-util";

export enum ResponseCatagory {
  INFO = 100,
  OK = 200,
  REDIRECT = 300,
  CLIENT_ERROR = 400,
  SERVER_ERROR = 500,
}

export class ServerResponse {
  private status: number;
  private body: any;

  constructor(status: number, body: any) {
    this.status = status;
    this.body = body;
  }

  public get Status() {
    return this.status;
  }

  public get Catagory() {
    return (this.status - (this.status % 100)) as ResponseCatagory;
  }

  public get Body() {
    return this.body;
  }

  public get IsError() {
    return (
      this.Catagory === ResponseCatagory.CLIENT_ERROR ||
      this.Catagory === ResponseCatagory.SERVER_ERROR
    );
  }
}

export class ServerResponseOk extends ServerResponse {
  constructor(body: any) {
    super(HttpStatusCode.OK, body);
  }
}

export class ServerResponseCreated extends ServerResponse {
  constructor(body: any) {
    super(HttpStatusCode.CREATED, body);
  }
}

export class ServerResponseNoContent extends ServerResponse {
  constructor(body: any) {
    super(HttpStatusCode.NO_CONTENT, body);
  }
}

export class ServerResponseBadRequest extends ServerResponse {
  constructor(body: any) {
    super(HttpStatusCode.BAD_REQUEST, body);
  }
}

export class ServerResponseUnAuthorized extends ServerResponse {
  constructor(body: any) {
    super(HttpStatusCode.UNAUTHORIZED, body);
  }
}

export class ServerResponseFormidden extends ServerResponse {
  constructor(body: any) {
    super(HttpStatusCode.FORBIDDEN, body);
  }
}

export class ServerResponseNotFound extends ServerResponse {
  constructor(body: any) {
    super(HttpStatusCode.NOT_FOUND, body);
  }
}

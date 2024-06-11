import { HttpStatusCode } from "../../common/http-util";

export enum ResponseCategory {
  INFO = 100,
  OK = 200,
  REDIRECT = 300,
  CLIENT_ERROR = 400,
  SERVER_ERROR = 500,
}

export class ServerResponse {
  constructor(
    private status: number,
    private body: any,
  ) {}

  public get Status() {
    return this.status;
  }

  public get Category() {
    return (this.status - (this.status % 100)) as ResponseCategory;
  }

  public get Body() {
    return this.body;
  }

  public get IsError() {
    return (
      this.Category === ResponseCategory.CLIENT_ERROR ||
      this.Category === ResponseCategory.SERVER_ERROR
    );
  }

  public static OK(body: any) {
    return new ServerResponse(HttpStatusCode.OK, body);
  }

  public static Created(body: any) {
    return new ServerResponse(HttpStatusCode.CREATED, body);
  }

  public static NoContent() {
    return new ServerResponse(HttpStatusCode.NO_CONTENT, {});
  }

  public static BadRequest(body: any) {
    return new ServerResponse(HttpStatusCode.BAD_REQUEST, body);
  }

  public static Unauthorized(body: any) {
    return new ServerResponse(HttpStatusCode.UNAUTHORIZED, body);
  }

  public static Forbidden(body: any) {
    return new ServerResponse(HttpStatusCode.FORBIDDEN, body);
  }

  public static NotFound(body: any) {
    return new ServerResponse(HttpStatusCode.NOT_FOUND, body);
  }
}

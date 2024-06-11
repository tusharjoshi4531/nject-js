import { Request } from "express";

export class MiddleWareResponse {
  constructor(private requestExtension: Partial<Request>) {}

  public get RequestExtention() {
    return this.requestExtension;
  }

  public static ExtendBody(body: any) {
    return new MiddleWareResponse({ body });
  }

  public static ExtendRequest(request: any) {
    return new MiddleWareResponse(request);
  }

  public static NoExtend() {
    return new MiddleWareResponse({});
  }
}

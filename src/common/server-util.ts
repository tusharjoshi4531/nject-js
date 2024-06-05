import express, { Request, Response } from "express";
import { HttpMethod } from "./http-util";

export enum RouteHandlerParameter {
  REQUEST = "REQUEST",
  RESPONSE = "RESPONSE",
  REQUEST_BODY = "REQUEST_BODY",
  REQUSET_QUERY = "REQUEST_QUERY",
  REQUEST_PARAMS = "REQUEST_PARAMS",
  REQUEST_HEADERS = "REQUEST_HEADERS",
}

export function getPropertyFromRequestOrResponse(
  param: RouteHandlerParameter,
  req: Request,
  res: Response
) {
  switch (param) {
    case RouteHandlerParameter.REQUEST:
      return req;
    case RouteHandlerParameter.RESPONSE:
      return res;
    case RouteHandlerParameter.REQUEST_BODY:
      return req.body;
    case RouteHandlerParameter.REQUEST_PARAMS:
      return req.params;
    case RouteHandlerParameter.REQUEST_HEADERS:
      return req.headers;
    case RouteHandlerParameter.REQUSET_QUERY:
      return req.query;
  }
}

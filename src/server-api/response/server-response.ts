import { HttpStatusCode } from "../../common/http-util";

export enum ResponseCategory {
  INFO = 100,
  OK = 200,
  REDIRECT = 300,
  CLIENT_ERROR = 400,
  SERVER_ERROR = 500,
}

export class ServerResponse {
  constructor(private status: number, private body: any) {}

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

  // Factory Methods
  public static Continue(body: any) {
    return new ServerResponse(HttpStatusCode.CONTINUE, body);
  }

  public static SwitchingProtocols(body: any) {
    return new ServerResponse(HttpStatusCode.SWITCHING_PROTOCOLS, body);
  }

  public static Processing(body: any) {
    return new ServerResponse(HttpStatusCode.PROCESSING, body);
  }

  public static OK(body: any) {
    return new ServerResponse(HttpStatusCode.OK, body);
  }

  public static Created(body: any) {
    return new ServerResponse(HttpStatusCode.CREATED, body);
  }

  public static Accepted(body: any) {
    return new ServerResponse(HttpStatusCode.ACCEPTED, body);
  }

  public static NonAuthoritativeInformation(body: any) {
    return new ServerResponse(
      HttpStatusCode.NON_AUTHORITATIVE_INFORMATION,
      body
    );
  }

  public static NoContent() {
    return new ServerResponse(HttpStatusCode.NO_CONTENT, {});
  }

  public static ResetContent(body: any) {
    return new ServerResponse(HttpStatusCode.RESET_CONTENT, body);
  }

  public static PartialContent(body: any) {
    return new ServerResponse(HttpStatusCode.PARTIAL_CONTENT, body);
  }

  public static MultiStatus(body: any) {
    return new ServerResponse(HttpStatusCode.MULTI_STATUS, body);
  }

  public static AlreadyReported(body: any) {
    return new ServerResponse(HttpStatusCode.ALREADY_REPORTED, body);
  }

  public static ImUsed(body: any) {
    return new ServerResponse(HttpStatusCode.IM_USED, body);
  }

  public static MultipleChoices(body: any) {
    return new ServerResponse(HttpStatusCode.MULTIPLE_CHOICES, body);
  }

  public static MovedPermanently(body: any) {
    return new ServerResponse(HttpStatusCode.MOVED_PERMANENTLY, body);
  }

  public static Found(body: any) {
    return new ServerResponse(HttpStatusCode.FOUND, body);
  }

  public static SeeOther(body: any) {
    return new ServerResponse(HttpStatusCode.SEE_OTHER, body);
  }

  public static NotModified(body: any) {
    return new ServerResponse(HttpStatusCode.NOT_MODIFIED, body);
  }

  public static UseProxy(body: any) {
    return new ServerResponse(HttpStatusCode.USE_PROXY, body);
  }

  public static TemporaryRedirect(body: any) {
    return new ServerResponse(HttpStatusCode.TEMPORARY_REDIRECT, body);
  }

  public static PermanentRedirect(body: any) {
    return new ServerResponse(HttpStatusCode.PERMANENT_REDIRECT, body);
  }

  public static BadRequest(body: any) {
    return new ServerResponse(HttpStatusCode.BAD_REQUEST, body);
  }

  public static Unauthorized(body: any) {
    return new ServerResponse(HttpStatusCode.UNAUTHORIZED, body);
  }

  public static PaymentRequired(body: any) {
    return new ServerResponse(HttpStatusCode.PAYMENT_REQUIRED, body);
  }

  public static Forbidden(body: any) {
    return new ServerResponse(HttpStatusCode.FORBIDDEN, body);
  }

  public static NotFound(body: any) {
    return new ServerResponse(HttpStatusCode.NOT_FOUND, body);
  }

  public static MethodNotAllowed(body: any) {
    return new ServerResponse(HttpStatusCode.METHOD_NOT_ALLOWED, body);
  }

  public static NotAcceptable(body: any) {
    return new ServerResponse(HttpStatusCode.NOT_ACCEPTABLE, body);
  }

  public static ProxyAuthenticationRequired(body: any) {
    return new ServerResponse(
      HttpStatusCode.PROXY_AUTHENTICATION_REQUIRED,
      body
    );
  }

  public static RequestTimeout(body: any) {
    return new ServerResponse(HttpStatusCode.REQUEST_TIMEOUT, body);
  }

  public static Conflict(body: any) {
    return new ServerResponse(HttpStatusCode.CONFLICT, body);
  }

  public static Gone(body: any) {
    return new ServerResponse(HttpStatusCode.GONE, body);
  }

  public static LengthRequired(body: any) {
    return new ServerResponse(HttpStatusCode.LENGTH_REQUIRED, body);
  }

  public static PreconditionFailed(body: any) {
    return new ServerResponse(HttpStatusCode.PRECONDITION_FAILED, body);
  }

  public static PayloadTooLarge(body: any) {
    return new ServerResponse(HttpStatusCode.PAYLOAD_TOO_LARGE, body);
  }

  public static URITooLong(body: any) {
    return new ServerResponse(HttpStatusCode.URI_TOO_LONG, body);
  }

  public static UnsupportedMediaType(body: any) {
    return new ServerResponse(HttpStatusCode.UNSUPPORTED_MEDIA_TYPE, body);
  }

  public static RangeNotSatisfiable(body: any) {
    return new ServerResponse(HttpStatusCode.RANGE_NOT_SATISFIABLE, body);
  }

  public static ExpectationFailed(body: any) {
    return new ServerResponse(HttpStatusCode.EXPECTATION_FAILED, body);
  }

  public static ImATeapot(body: any) {
    return new ServerResponse(HttpStatusCode.IM_A_TEAPOT, body);
  }

  public static MisdirectedRequest(body: any) {
    return new ServerResponse(HttpStatusCode.MISDIRECTED_REQUEST, body);
  }

  public static UnprocessableEntity(body: any) {
    return new ServerResponse(HttpStatusCode.UNPROCESSABLE_ENTITY, body);
  }

  public static Locked(body: any) {
    return new ServerResponse(HttpStatusCode.LOCKED, body);
  }

  public static FailedDependency(body: any) {
    return new ServerResponse(HttpStatusCode.FAILED_DEPENDENCY, body);
  }

  public static TooEarly(body: any) {
    return new ServerResponse(HttpStatusCode.TOO_EARLY, body);
  }

  public static UpgradeRequired(body: any) {
    return new ServerResponse(HttpStatusCode.UPGRADE_REQUIRED, body);
  }

  public static PreconditionRequired(body: any) {
    return new ServerResponse(HttpStatusCode.PRECONDITION_REQUIRED, body);
  }

  public static TooManyRequests(body: any) {
    return new ServerResponse(HttpStatusCode.TOO_MANY_REQUESTS, body);
  }

  public static RequestHeaderFieldsTooLarge(body: any) {
    return new ServerResponse(
      HttpStatusCode.REQUEST_HEADER_FIELDS_TOO_LARGE,
      body
    );
  }

  public static UnavailableForLegalReasons(body: any) {
    return new ServerResponse(
      HttpStatusCode.UNAVAILABLE_FOR_LEGAL_REASONS,
      body
    );
  }

  public static InternalServerError(body: any) {
    return new ServerResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, body);
  }

  public static NotImplemented(body: any) {
    return new ServerResponse(HttpStatusCode.NOT_IMPLEMENTED, body);
  }

  public static BadGateway(body: any) {
    return new ServerResponse(HttpStatusCode.BAD_GATEWAY, body);
  }

  public static ServiceUnavailable(body: any) {
    return new ServerResponse(HttpStatusCode.SERVICE_UNAVAILABLE, body);
  }

  public static GatewayTimeout(body: any) {
    return new ServerResponse(HttpStatusCode.GATEWAY_TIMEOUT, body);
  }

  public static HTTPVersionNotSupported(body: any) {
    return new ServerResponse(HttpStatusCode.HTTP_VERSION_NOT_SUPPORTED, body);
  }

  public static VariantAlsoNegotiates(body: any) {
    return new ServerResponse(HttpStatusCode.VARIANT_ALSO_NEGOTIATES, body);
  }

  public static InsufficientStorage(body: any) {
    return new ServerResponse(HttpStatusCode.INSUFFICIENT_STORAGE, body);
  }

  public static LoopDetected(body: any) {
    return new ServerResponse(HttpStatusCode.LOOP_DETECTED, body);
  }

  public static NotExtended(body: any) {
    return new ServerResponse(HttpStatusCode.NOT_EXTENDED, body);
  }

  public static NetworkAuthenticationRequired(body: any) {
    return new ServerResponse(
      HttpStatusCode.NETWORK_AUTHENTICATION_REQUIRED,
      body
    );
  }
}

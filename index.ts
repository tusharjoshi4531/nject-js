import { Request, Response } from "express";
import { Constructor } from "./src/common/component-util";
import { RouteHandlerParameter } from "./src/common/server-util";
import { ServerApplication } from "./src/server-api/application/application";
import { Application } from "./src/server-api/application/application-decorator";
import { RestController } from "./src/server-api/controller/rest-controller-decorator";
import {
  ControllerParameter,
  RequestBody,
  RequestParams,
} from "./src/server-api/controller/rest-handler-parameter-decorator";
import { ServerConfig } from "./src/server-api/server-config";
import {
  GET,
  POST,
  PUT,
  RestHandler,
} from "./src/server-api/controller/rest-handler-decorator";
import { HttpMethod } from "./src/common/http-util";
import { Component } from "./src/server-api/component/component-decorator";
import { Inject } from "./src/server-api/component/dependancy-injection-decorator";
import applicationContext from "./src/context/application-context";
import { createComponentIdFromConstructor } from "./src/common/id-util";
import {
  ServerResponseNoContent,
  ServerResponseOk,
} from "./src/server-api/response/server-response";

@Component
class BookService {
  private books: Array<{ id: string; name: string; users: string[] }> = [
    {id: "0", name: "book1", users: []}
  ];

  public findAllBooks() {
    return this.books;
  }

  public addBook(name: string) {
    this.books.push({
      id: BookService.genUid(),
      name,
      users: [],
    });
  }

  public findById(id: string) {
    return this.books.find((book) => book.id === id);
  }

  public assignUser(id: string, userId: string) {
    this.findById(id)?.users.push(userId);
  }

  private static UID = 1;
  static genUid() {
    const id = this.UID.toString();
    this.UID++;
    return id;
  }
}

@Component
class UserService {
  private users: Array<{
    id: string;
    name: string;
    password: string;
    books: string[];
  }> = [
    {id: "0", name: "test", password: "123", books: []}
  ];

  public findAllUsers() {
    return this.users;
  }

  public addUser(name: string, password: string) {
    this.users.push({
      id: UserService.genUid(),
      name,
      password,
      books: [],
    });
  }

  public findById(id: string) {
    return this.users.find((user) => user.id === id);
  }

  public assignBook(id: string, bookId: string) {
    this.findById(id)?.books.push(bookId);
  }

  private static UID = 1;
  static genUid() {
    const id = this.UID.toString();
    this.UID++;
    return id;
  }
}

@RestController("/books")
class BookController {
  constructor(@Inject(BookService) private bookService: BookService) {}

  @GET("")
  public getBooks() {
    const books = this.bookService.findAllBooks();
    return new ServerResponseOk(books);
  }

  @POST("")
  public addBook(@RequestBody body: { name: string }) {
    this.bookService.addBook(body.name);
    return new ServerResponseNoContent();
  }

  @POST("/:id")
  public getUserById(@RequestParams params: { id: string }) {
    const book = this.bookService.findById(params.id);
    return new ServerResponseOk({ book });
  }
}

@RestController("/users")
class UserController {
  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(BookService) private bookService: BookService
  ) {}

  @GET("")
  public getUsers() {
    const users = this.userService.findAllUsers();
    console.log(users);
    return new ServerResponseOk({ users });
  }

  @POST("")
  public addUser(@RequestBody body: { name: string; password: string }) {
    this.userService.addUser(body.name, body.password);
    return new ServerResponseNoContent();
  }

  @GET("/:id")
  public getUserById(@RequestParams params: { id: string }) {
    const user = this.userService.findById(params.id);
    return new ServerResponseOk({ user });
  }

  @PUT("/:id/:bookId")
  public assignBook(@RequestParams params: { id: string; bookId: string }) {
    this.bookService.assignUser(params.bookId, params.id);
    this.userService.assignBook(params.id, params.bookId);
    return new ServerResponseNoContent();
  }
}

@Application
class MainApplication extends ServerApplication {
  public get Config() {
    return ServerConfig.create().setPort(8000);
  }
}

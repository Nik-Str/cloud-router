<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Nik-Str/cloud-router">
    <img src="assets/logo.png" alt="Logo" width="320" height="320">
  </a>

  <h2 align="center">Cloud Router</h2>

  <p align="center">
    A framework to build and organize your backend API using Cloudflare workers.
    <br />
    <a href="https://github.com/Nik-Str/cloud-router/blob/master/README.md"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Nik-Str/cloud-router/tree/master/example">View Demo</a>
    ·
    <a href="https://github.com/Nik-Str/cloud-router/issues">Report Bug</a>
    ·
    <a href="https://github.com/Nik-Str/cloud-router/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->

<summary>Table of Contents</summary>

<details>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#api">API</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

Inspired by Express.js, Cloud Router makes it easier to build and organize your backend API using Cloudflare Workers. Written in TypeScript, this framework works as a wrapper around your application's logic, handling the execution of middlewares and controller callbacks in an easy-to-use fashion.

Key features:

- Application structuring and organization
- Router registration for API endpoints and middlewares
- Built-in response methods to remove unnecessary boilerplate code

This project should be considered a work in progress, with the goal of adding more features soon. You can suggest any changes by forking this repository and creating a pull request or opening an issue.

<!-- GETTING STARTED -->

## Getting Started

To use this package, you need Node.js and npm installed on your local machine.

```sh
npm install cloud-router
```

<!-- USAGE EXAMPLES -->

## Usage

```typescript
// router.ts
import { Router, ClientRequest, WorkerResponse } from 'cloud-router';

const router = new Router();
router.get('/', (req: ClientRequest, res: WorkerResponse) => {
  return res.json({ data: 'Hello World!' });
});

export default router;

// app.ts
import { App } from 'cloud-router';
import router from './router';

const app = new App();
app.setRouter('api', router);

export default app;

// index.ts
import { Worker } from 'cloud-router';
import app from './app';

const handler: ExportedHandler = {
  async fetch(request: Request) {
    const worker = new Worker(request, app);
    return await worker.listen();
  }
};

export default worker;
```

_For more advanced examples: [Example](https://github.com/Nik-Str/cloud-router/tree/master/example)_

<!-- API -->

## API

Cloud Router defines two types of callback functions: Controllers and Middlewares. What sets them apart is the expected return value, where a Controller should return a response, but a middleware could return either a response or void.

| Method/Class          | Docs                                                                                                                                                                                                                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `WorkerResponse`      |                                                                                                                                                                                                                                                                                                                    |
| .status()             | The `status` function sets the HTTP status code of the response object. It takes one argument, which is the response code itself, and then returns the `WorkerResponse` object.                                                                                                                                    |
| .json()               | The `json` function takes any valid data types that can be stringified to JSON as its argument and returns a new `Response` object.                                                                                                                                                                                |
| .send()               | The `send` method accepts two arguments: 1. The response body. 2. A string representing the HTTP header 'Content-Type'. It returns a new `Response` object.                                                                                                                                                        |
| .redirect()           | The `redirect` method returns a new `Response` object that redirects the incoming request to the specified URL or path.                                                                                                                                                                                            |
| .pipe()               | The `pipe` method takes a response object as its argument and pipes it to a new `Response` object that it returns.                                                                                                                                                                                                 |
| .setHeaders()         | The `setHeaders` method accepts an object containing multiple headers, attaches it to the response object, and returns the `WorkerResponse` object.                                                                                                                                                                |
| .setHeader()          | The `setHeader` method takes two arguments that represent the name and value of a header. It attaches this header information to the response object and returns the `WorkerResponse` object.                                                                                                                      |
| .clearHeaders()       | The `clearHeaders` method clears all the attached headers from the response object and returns the `WorkerResponse` object.                                                                                                                                                                                        |
| .clearHeader()        | The `clearHeader` method takes a string representing a header name as its argument, removes that header from the response object, and returns the `WorkerResponse` object.                                                                                                                                         |
| .getHeaders()         | The `getHeaders` method returns all the headers that are attached to the response object.                                                                                                                                                                                                                          |
| .getHeader()          | The `getHeader` method takes one argument representing the name of a header and returns the corresponding value of that header.                                                                                                                                                                                    |
| .setCookie()          | The `setCookie` method accepts three arguments: 1. The name of the cookie. 2. The value of the cookie. 3. Any optional valid cookie options. The method attaches these values as a cookie to the response object and returns the `WorkerResponse` object.                                                          |
| .clearCookie()        | The `clearCookie` function removes the specified cookie from the response object provided as an argument and returns the `WorkerResponse` object.                                                                                                                                                                  |
| `ClientRequest`       |                                                                                                                                                                                                                                                                                                                    |
| .param                | This property holds the value of the dynamic path provided in the Router registration method.                                                                                                                                                                                                                      |
| .url                  | This property holds a URL object representing the request URL.                                                                                                                                                                                                                                                     |
| `Router`              |                                                                                                                                                                                                                                                                                                                    |
| .get()                | The `get` method represents an HTTP GET API endpoint. Its function takes two arguments: 1. The path to trigger its execution. 2. A controller function. You can specify a dynamic path using the `path/:nameOfValue` syntax. This value can then be found in the `req.params` object (see above).                  |
| .post()               | Same as above, but it represents an HTTP POST API endpoint.                                                                                                                                                                                                                                                        |
| .put()                | Same as above, but it represents an HTTP PUT API endpoint.                                                                                                                                                                                                                                                         |
| .patch()              | Same as above, but it represents an HTTP PATCH API endpoint.                                                                                                                                                                                                                                                       |
| .delete()             | Same as above, but it represents an HTTP DELETE API endpoint.                                                                                                                                                                                                                                                      |
| .option()             | Same as above, but it represents an HTTP OPTION API endpoint.                                                                                                                                                                                                                                                      |
| .head()               | Same as above, but it represents an HTTP HEAD API endpoint.                                                                                                                                                                                                                                                        |
| `App`                 |                                                                                                                                                                                                                                                                                                                    |
| .authenticate()       | The `authenticate` function takes a middleware function as an argument. This callback will be executed first for every incoming request.                                                                                                                                                                           |
| .public()             | The `public` function takes two arguments: 1. The base URL path of an incoming request that would trigger its callback. 2. The callback controller function. You can have multiple public routes in an application. Public routes are executed after the authentication callback but before any other middlewares. |
| .middleware()         | The `middleware` function takes one or multiple middleware functions as its argument. These middlewares will be executed in order for every incoming request.                                                                                                                                                      |
| .setRouter()          | The `setRouter` function takes three arguments: 1. The base URL path of an incoming request that would trigger its callback. 2. A `Router` class instance. 3. One or multiple middlewares specific to any underlying endpoints of the router instance. You can have multiple routers in an application.            |
| .error()              | The `error` function takes a controller function as its argument. This callback will be executed if an error occurs within your application outside of any lower-level try/catch block.                                                                                                                            |
| .notFound()           | The `notFound` function takes a controller function as its argument. Its callback will be executed if no registered routes match the incoming request URL path.                                                                                                                                                    |
| .getAuthHandler()     | Returns the authentication middleware.                                                                                                                                                                                                                                                                             |
| .getPublicRoutes()    | Returns all registered public routes.                                                                                                                                                                                                                                                                              |
| .getMiddlewares()     | Returns all application middlewares.                                                                                                                                                                                                                                                                               |
| .getRouters()         | Returns all registered routers.                                                                                                                                                                                                                                                                                    |
| .getErrorHandler()    | Returns the error controller.                                                                                                                                                                                                                                                                                      |
| .getNotFoundHandler() | Returns the notFound controller.                                                                                                                                                                                                                                                                                   |
| `Worker`              |                                                                                                                                                                                                                                                                                                                    |
| .listen()             | The `listen` function executes your application logic upon incoming requests and returns a response. It takes three arguments: 1. The incoming request. 2. An `App` object instance. 3. Any default headers that should be attached to every outgoing response.                                                    |

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

Project Author: - [https://www.linkedin.com/in/niklas-str%C3%B6mberg-59b428169/](https://www.linkedin.com/in/niklas-str%C3%B6mberg-59b428169/)

Project Link: [https://github.com/Nik-Str/cloud-router](https://github.com/Nik-Str/cloud-router)

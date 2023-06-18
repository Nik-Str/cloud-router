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

<ol>
  <li><a href="#about-the-project">About The Project</a></li>
  <li><a href="#getting-started">Getting Started</a></li>
  <li><a href="#usage">Usage</a></li>
   <li><a href="#api">API</a></li>
  <li><a href="#contributing">Contributing</a></li>
  <li><a href="#license">License</a></li>
  <li><a href="#contact">Contact</a></li>
</ol>

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

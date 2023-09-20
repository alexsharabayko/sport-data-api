## Description

Example date stream application for tournaments

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Notes
 - the whole logic is encapsulated in `tournament` module
 - the service is source of business logic and state of this service is the same for all connections
 - gateway is dedicated for each connection
 - instead of restriction of subscribing more frequently that 5 minutes I've implemented restriction to subscribe if another stream is in progress because it's more clear demonstration of such restriction
 - currently the service contain whole logic but in real life it should be facade of it, it could be connected with repositories/apis/sources/other services
 - there is no databases, caches or smth like that here just to make testing/launching of it easier
 - there is no restart functionality at the moment because it has no much sense in the current implementation
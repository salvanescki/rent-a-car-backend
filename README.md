ScaleMote

# Rent-a-Car

## Description

Rent-a-Car is a web application designed to manage the car rental system of the Australian company Car Rental. It consists of a car catalog, a rental service, and a payment system.

## Functionality

The application is designed to comply with this requirements:

- Authentication & Authorization
  - Sign Up
  - Forgot password
  - Login
  - Logout
  - Forbid unauthorized access to screens
  - User and Admin roles
- Catalogue
  - Users can see the list of available cars
  - Users can select a car to see their details and pictures
- Rental
  - Users can complete a form to request a rental
- User
  - Users can complete their details
  - Users can upload documents
- Admin
  - Admin can upload cars to the catalogue
  - Admin can review, approve and deny rental requests
- Stellar
  - Users can perform payments using the Stellar Network

## Stack

- React and Nest.JS, both using TypeScript
- PostgreSQL database
- LocalStack to emulate AWS services
  - AWS S3 for image storage
  - AWS Cognito to manage user log-in
- Template from Tailwind UI

## Prerequisites

- PostgreSQL (You need to create a database and fill it up your private .env file with the data listed on .env.example)

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Set up AWS Cognito environment variables

This backend uses [jagregory/cognito-local](https://github.com/jagregory/cognito-local) docker image, emulating the service Cognito in local machine.

You need to generate a AWS_COGNITO_USER_POOL_ID and a AWS_COGNITO_CLIENT_ID with aws-cli for the service to work.

First of all, [install the aws-cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

Once installed, execute the following command in root directory:

```bash
docker compose up --build -d
```

This will create and start the docker containers.

After that, you need to create an user pool with the aws-cli:

```bash
aws --endpoint http://localhost:9229 cognito-idp create-user-pool --pool-name "MyUserPool"
```

This will generate and return a json with the user pool data.

Using this command you can verify the user pool was successfully created:

```bash
aws --endpoint http://localhost:9229 cognito-idp list-user-pools --max-results 10
```

Copypaste the user pool id in .env AWS_COGNITO_USER_POOL_ID.

Now, you need to generate a client id:

```bash
aws cognito-idp create-user-pool-client --user-pool-id <YOUR USER POOL ID> --client-name my-app-client  --no-cli-pager --endpoint-url http://localhost:9229
```

Replace `<YOUR USER POOL ID>` with the user pool id you've just generated before.

Finally, copy the client id from the json to .env AWS_COGNITO_CLIENT_ID.

Now, It's fully configurated.

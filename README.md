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

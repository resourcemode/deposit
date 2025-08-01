# Time Deposit System - NestJS Implementation

A RESTful API for managing time deposits, built with NestJS following Clean Architecture and SOLID principles.

## Features

- Get all time deposits
- Update balances of all time deposits based on plan type and conditions
- PostgreSQL database integration
- Dockerized application

## API Endpoints

- `GET /time-deposits` - Retrieves all time deposits with their withdrawals
- `PATCH /time-deposits/update-balances` - Updates the balances of all time deposits according to their plan types

## Running with Docker

The easiest way to run the application is using Docker and Docker Compose.

### Prerequisites

- Docker
- Docker Compose

### Steps

1. Clone the repository
2. Navigate to the typescript directory
3. Run the application with Docker Compose:

```sh
docker-compose up --build
```

The API will be accessible at `http://localhost:3000`

## Running Locally

### Prerequisites

- Node.js >= 16.0.0
- PostgreSQL

### Installation

#### Install nvm (optional)

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

Running the above command downloads a script and runs it. The script clones the nvm repository to `~/.nvm`, and attempts to add the source lines from the snippet below to the correct profile file (`~/.bash_profile`, `~/.zshrc`, `~/.profile`, or `~/.bashrc`).

```sh
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

#### Install Node.js using nvm

```sh
nvm install 16.16.0
```

#### Install dependencies

```sh
yarn install
```
or
```sh
npm install
```

### Configuration

Create a `.env` file in the project root with the following content (adjust according to your PostgreSQL setup):

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=timedeposits
PORT=3000
NODE_ENV=development
```

### Database Seeding

To populate the database with initial time deposit and withdrawal data:

```sh
# Start PostgreSQL with Docker Compose first
npm run start:db

# Then run the database seeder
npm run seed
```

### Run the server

```sh
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### Test suite

```sh
# Unit tests
npm test

# Integration tests (requires PostgreSQL running via Docker Compose)
npm run test:integration
```

## Architecture

The application follows Clean Architecture principles, with a clear separation of concerns:

- **Domain Layer**: Contains the business logic and rules (entities, models, repositories interfaces)
- **Application Layer**: Contains use cases (services)
- **Infrastructure Layer**: Contains implementations of repositories and external services
- **Presentation Layer**: Contains controllers and DTOs for API endpoints

## Interest Calculation

Interest is calculated based on plan type:
- **Basic plan**: 1% interest
- **Student plan**: 3% interest (no interest after 1 year)
- **Premium plan**: 5% interest (interest starts after 45 days)

No interest is applied for the first 30 days for all plans.

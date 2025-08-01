# Time Deposit System - NestJS Implementation

[![Unit Tests](https://github.com/resourcemode/deposit/workflows/Unit%20Tests/badge.svg)](https://github.com/resourcemode/deposit/actions/workflows/unit-tests.yml)
[![Integration Tests](https://github.com/resourcemode/deposit/workflows/Integration%20Tests/badge.svg)](https://github.com/resourcemode/deposit/actions/workflows/integration-tests.yml)
[![Security Scan](https://github.com/resourcemode/deposit/workflows/Security%20Scan/badge.svg)](https://github.com/resourcemode/deposit/actions/workflows/security-scan.yml)
[![Comprehensive CI](https://github.com/resourcemode/deposit/workflows/Comprehensive%20CI/badge.svg)](https://github.com/resourcemode/deposit/actions/workflows/comprehensive-ci.yml)
[![codecov](https://codecov.io/gh/resourcemode/deposit/branch/main/graph/badge.svg?token=YOUR_CODECOV_TOKEN)](https://codecov.io/gh/resourcemode/deposit)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A RESTful API for managing time deposits, built with NestJS following Clean Architecture and SOLID principles.

## Features

- Get all time deposits
- Update balances of all time deposits based on plan type and conditions
- PostgreSQL database integration
- Dockerized application

## API Documentation

### Interactive API Documentation (Swagger)

Once the application is running, you can access the interactive Swagger API documentation at:

**🔗 [http://localhost:3000/api](http://localhost:3000/api)**

The Swagger UI provides:

- ✅ **Interactive API Testing** - Test endpoints directly from the browser
- 📋 **Complete API Schema** - Detailed request/response models
- 🔍 **Parameter Documentation** - All query parameters and request bodies
- 📖 **Endpoint Descriptions** - Comprehensive API documentation
- 🚀 **Try It Out** - Execute real API calls with sample data

### API Endpoints

- `GET /time-deposits` - Retrieves all time deposits with their withdrawals
- `PATCH /time-deposits/update-balances` - Updates the balances of all time deposits according to their plan types

### Response Models

#### TimeDepositDto

```json
{
  "id": 1,
  "planType": "BASIC",
  "balance": "1002.50",
  "days": 90,
  "withdrawals": [
    {
      "id": 1,
      "timeDepositId": 1,
      "amount": "100.00",
      "date": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

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

If you encounter an error during `docker-compose up --build` because of node dependency or seeder error, it means we need to run `npm install` first

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

## CI/CD

This project uses GitHub Actions with **separate workflows** for unit and integration tests, following CI/CD best practices:

### Workflow Structure

1. **Unit Tests** (`.github/workflows/unit-tests.yml`)
   - Fast feedback without database dependencies
   - Runs on Node.js versions 18.x, 20.x, and 22.x
   - No external services required
   - Generates unit test coverage

2. **Integration Tests** (`.github/workflows/integration-tests.yml`)
   - Full database integration testing
   - PostgreSQL 15 service with health checks
   - Tests database connectivity and data operations
   - Generates integration test coverage

3. **Security Scan** (`.github/workflows/security-scan.yml`)
   - CodeQL static analysis for security issues
   - Runs weekly and on every push/PR
   - Focuses on code-level security vulnerabilities

4. **Comprehensive CI** (`.github/workflows/comprehensive-ci.yml`)
   - Orchestrates unit tests, integration tests, and security scans
   - Runs all workflows in parallel for efficiency
   - Provides unified status reporting
   - Required for release automation

5. **Automated Release** (`.github/workflows/release.yml`)
   - Automatically creates release tags on successful CI completion
   - Increments semantic version numbers (patch version)
   - Creates GitHub releases with detailed changelogs
   - Only triggers on main branch after comprehensive CI success

### Benefits of Separate Workflows

- **Speed**: Unit tests provide fast feedback (no DB setup)
- **Reliability**: Unit tests don't depend on external services
- **Security**: Automated vulnerability detection and code analysis
- **Clear Diagnostics**: Easy to identify logic vs. integration vs. security issues
- **Resource Efficiency**: Unit tests use fewer CI resources
- **Parallel Execution**: All workflows run simultaneously

### Environment Variables for CI

The following environment variables are automatically set in CI:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=timedeposits
NODE_ENV=test
```

### Running Tests Locally

To run tests locally with the same configuration as CI:

```sh
# Start the database
npm run start:db

# Run tests with CI configuration
npm run test:ci

# Or run tests with coverage
npm run test:cov
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

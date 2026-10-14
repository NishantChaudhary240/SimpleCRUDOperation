# SimpleCRUDOperation

A simple employee management app with a React + TypeScript frontend, a Node.js + TypeScript API, and PostgreSQL persistence through Sequelize.

## Features

- List employees
- Add, edit, and delete employees
- Store each employee's name, age, department, salary, and optional mobile number

## Prerequisites

- Node.js and npm (use a version supported by Vite 8)
- PostgreSQL running locally or reachable from your machine
- A PostgreSQL database and user for this application

## Setup

### 1. Configure the backend

Create `Backend/.env` with your PostgreSQL connection settings:

```env
DB_NAME=your_database_name
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
PORT=5001
```

`DB_NAME` and `DB_USER` are required. `DB_PASSWORD` may be left empty for a local PostgreSQL setup that does not use a password. `DB_HOST`, `DB_PORT`, and `PORT` default to `localhost`, `5432`, and `5001`, respectively.

### 2. Install dependencies

From the repository root, install backend and frontend dependencies in separate terminals:

```bash
cd Backend
npm install
```

```bash
cd Frontend
npm install
```

### 3. Start the app

Start the backend in one terminal:

```bash
cd Backend
npm run dev
```

The backend authenticates with PostgreSQL, creates the employee table if needed, and listens at `http://localhost:5001`.

Start the frontend in another terminal:

```bash
cd Frontend
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). The API currently allows browser requests from that origin.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | Check that the backend is running |
| `GET` | `/api/employees` | List employees |
| `POST` | `/api/employees` | Create an employee |
| `PUT` | `/api/employees/:id` | Update an employee |
| `DELETE` | `/api/employees/:id` | Delete an employee |

Create and update requests accept JSON in this shape:

```json
{
  "name": "Ram Mahara",
  "age": 30,
  "department": "Engineering",
  "salary": 85000,
  "mobile": "9800000000"
}
```

The `mobile` field is optional.

## Build and lint

Build the backend:

```bash
cd Backend
npm run build
```

Build or lint the frontend:

```bash
cd Frontend
npm run build
npm run lint
```

## Notes

- A separate database test helper is not required to run the application. Database connection and table synchronization happen when the backend server starts.
- Keep database credentials in `Backend/.env`; do not commit secrets.

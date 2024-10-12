# Pokémon Battle Application

Welcome to the Pokémon Battle Application! This project is a full-stack web application that allows users to view, modify, and interact with a list of Pokémon. The frontend is built with **Angular** using **standalone components** and **Bootstrap** for styling. The backend is powered by **Node.js**, **Express**, and **Supabase** as the database.

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [GET /api/pokemon](#get-apipokemon)
  - [GET /api/pokemon/:id](#get-apipokemonid)
  - [PUT /api/pokemon/:id](#put-apipokemonid)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Additional Notes](#additional-notes)
- [License](#license)

---

## Features

- **Display Pokémon List**: View a list of Pokémon with their details.
- **Modify Pokémon**: Edit Pokémon attributes like type, power, and life.
- **Responsive Design**: The app is styled using Bootstrap for responsiveness.
- **API Integration**: Communicates with a backend API built with Express and Supabase.

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v14 or later)
- **npm** (Node Package Manager)
- **Angular CLI** (v18.2.1 or compatible)
- **Supabase Account**: For database services

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/mohamedaleya/pokemon-battle-app.git
```

### 2. Navigate to the Project Directory

```bash
cd pokemon-battle-app
```

### 3. Install Dependencies

Install all dependencies (server and client) from the root directory:

```bash
npm install
```

### 4. Set Up Environment Variables

Create a `.env` file in the root directory with the following content (or copy and rename .env.example):

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=5000
```

- Replace `your_supabase_url` with your Supabase project URL.
- Replace `your_supabase_anon_key` with your Supabase anonymous API key.

---

## Running the Application

You can run both the server and client concurrently using npm scripts.

### Start the Application

From the root directory:

```bash
npm start
```

This command runs:

- **Server**: Runs on `http://localhost:5000` (or the port specified in your .env file)
- **Client**: Runs on `http://localhost:4200`

The client uses a proxy configuration to forward API requests to the server.

---

## API Endpoints

The backend API provides the following endpoints:

### GET /api/pokemon

Retrieve a list of all Pokémon.

- **URL**: `/api/pokemon`
- **Method**: `GET`
- **Response**: An array of Pokémon objects with their types.

#### Example Response

```json
[
  {
    "id": "1f4b5f57-6c9d-461b-9819-33357287b1c0",
    "name": "Bayleef",
    "image": "https://example.com/bayleef.png",
    "power": 62,
    "life": 60,
    "typeName": "Grass"
  },
  {
    "id": "2a6c5f58-7d9f-472b-9820-44458387b2d1",
    "name": "Charizard",
    "image": "https://example.com/charizard.png",
    "power": 84,
    "life": 78,
    "typeName": "Fire"
  }
]
```

### GET /api/pokemon/:id

Retrieve a single Pokémon by its ID.

- **URL**: `/api/pokemon/:id`
- **Method**: `GET`
- **URL Parameters**:
  - `id` (string): The ID of the Pokémon.
- **Response**: A Pokémon object with its type.

#### Example Request

```bash
GET /api/pokemon/2a6c5f58-7d9f-472b-9820-44458387b2d1
```

#### Example Response

```json
{
  "id": "2a6c5f58-7d9f-472b-9820-44458387b2d1",
  "name": "Charizard",
  "image": "https://example.com/charizard.png",
  "power": 84,
  "life": 78,
  "typeName": "Fire"
}
```

### PUT /api/pokemon/:id

Update a Pokémon's details.

- **URL**: `/api/pokemon/:id`
- **Method**: `PUT`
- **URL Parameters**:
  - `id` (string): The ID of the Pokémon to update.
- **Request Body**: JSON object with the fields to update.
- **Response**: The updated Pokémon object.

#### Request Body Parameters

- `typeName` (string): The name of the Pokémon's type.
- `life` (number): The life value.
- `power` (number): The power value.

#### Example Request

```bash
PUT /api/pokemon/2a6c5f58-7d9f-472b-9820-44458387b2d1
Content-Type: application/json

{
  "typeName": "Fire",
  "life": 80,
  "power": 85
}
```

#### Example Response

```json
{
  "id": "2a6c5f58-7d9f-472b-9820-44458387b2d1",
  "name": "Charizard",
  "image": "https://example.com/charizard.png",
  "power": 85,
  "life": 80,
  "typeName": "Fire"
}
```

---

## Project Structure

```bash
pokemon-battle-app/
├── client/                 # Angular frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── app.config.ts
│   │   │   ├── app.routes.ts
│   │   ├── index.html
│   ├── proxy.conf.json     # Proxy configuration for development
├── server/                 # Express backend application
│   ├── index.js            # Main server file
│   ├── data/               # CSV data files
│   │   ├── pokemon_type.csv
│   │   ├── pokemon.csv
│   │   └── weakness.csv
│   ├── scripts/            # SQL scripts
│   │   ├── get-teams-ordered-by-power.sql
│   │   ├── insert-team.sql
│   │   └── team-and-pokemon-overview.sql
├── .env                    # Environment variables
├── package.json            # Project dependencies and scripts
└── README.md
```

## Data and Scripts

The application includes pre-populated data and SQL scripts for database operations:

### Data Files

Located in the `server/data/` directory:

- `pokemon_type.csv`: Contains information about Pokémon types.
- `pokemon.csv`: Contains the main Pokémon data.
- `weakness.csv`: Contains information about type weaknesses.

### SQL Scripts

Located in the `server/scripts/` directory:

- `get-teams-ordered-by-power.sql`: SQL query to retrieve teams ordered by their power.
- `insert-team.sql`: SQL script for inserting new teams into the database.
- `team-and-pokemon-overview.sql`: SQL query to get an overview of teams and their Pokémon.

These files are used to initialize and manage the database. Ensure that you have the necessary permissions and have set up your Supabase project to use these scripts and data files.

---

## Troubleshooting

### 1. CORS Errors

The server is configured to use CORS. If you're still encountering CORS issues, ensure that the client is making requests to the correct URL and that the proxy is set up correctly.

### 2. API Requests Not Working

Check that the proxy configuration in `client/proxy.conf.json` is correctly set up:

```json
{
  "/api": {
    "target": "http://localhost:5000",
    "secure": false
  }
}
```

### 3. Database Connection Issues

Ensure that your `.env` file contains the correct Supabase URL and API key. If the issue persists, check your Supabase console for any service disruptions or connection limits.

### 4. TypeScript Errors

If you encounter TypeScript errors, ensure you're using a compatible version (5.5.2 as specified in package.json). You may need to run `npm install` again if you've updated TypeScript.

---

## Additional Notes

### Supabase Integration

This project uses Supabase as the backend database. Ensure you have set up the following tables in your Supabase project:

- `pokemon`: Stores Pokémon data (id, name, image, power, life, type)
- `pokemon_type`: Stores Pokémon types (id, name)

### Environment Variables

The application uses dotenv to manage environment variables. Ensure your `.env` file is properly configured and located in the root directory.

### Concurrent Development

The project uses `concurrently` to run both the server and client simultaneously during development. This is configured in the `scripts` section of `package.json`.

---

## Contact

For any questions or feedback, please contact mohamed.aleya@outlook.com.

---

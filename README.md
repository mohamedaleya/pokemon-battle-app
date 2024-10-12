# Pokémon Battle Application

Welcome to the Pokémon Battle Application! This project is a full-stack web application that allows users to view, modify, and interact with a list of Pokémon, as well as create teams of pokemons that can enter to battle against other teams. The frontend is built with **Angular** using **standalone components** and **Bootstrap** for styling. The backend is powered by **Node.js**, **Express**, and **Supabase** as the database.

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
  - [GET /api/teams](#get-apiteams)
  - [POST /api/teams](#post-apiteams)
  - [GET /api/team/:teamId](#get-apiteamteamid)
  - [GET /api/type-factor/:type1/:type2](#get-apitype-factortype1type2)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Additional Notes](#additional-notes)

---

## Features

- **Display Pokémon List**: View a list of Pokémon with their details.
- **Modify Pokémon**: Edit Pokémon attributes like type, power, and life.
- **Team Management**: Create and view Pokémon teams.
- **Battle Simulation**: Calculate type effectiveness in Pokémon battles.
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

### 5. Seed your database

Import the CSV files in /server/data into your tables:

- pokemon_type.csv
- pokemon.csv
- weakness.csv

Import the Supabase PostgreSQL functions in /server/scripts to your Supabase project:

- get-teams-ordered-by-power.sql
- insert-team.sql
- team-and-pokemon-overview.sql

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

### GET /api/teams

Retrieve a list of all teams ordered by their total power.

- **URL**: `/api/teams`
- **Method**: `GET`
- **Response**: An array of team objects with their total power.

#### Example Response

```json
[
  {
    "id": 1,
    "team_name": "Team Rocket",
    "total_power": 300
  },
  {
    "id": 2,
    "team_name": "Elite Four",
    "total_power": 450
  }
]
```

### POST /api/teams

Create a new team.

- **URL**: `/api/teams`
- **Method**: `POST`
- **Response**: The ID of the newly created team.

#### Example Response

```json
{
  "new_team_id": 3
}
```

### GET /api/team/:teamId

Retrieve details of a specific team, including its Pokémon.

- **URL**: `/api/team/:teamId`
- **Method**: `GET`
- **URL Parameters**:
  - `teamId` (number): The ID of the team.
- **Response**: An object containing team details and an array of its Pokémon.

#### Example Request

```bash
GET /api/team/1
```

#### Example Response

```json
{
  "team": {
    "id": 1,
    "name": "Team Rocket"
  },
  "pokemons": [
    {
      "id": "1f4b5f57-6c9d-461b-9819-33357287b1c0",
      "name": "Bayleef",
      "type": 1,
      "power": 62,
      "life": 60,
      "image": "https://example.com/bayleef.png"
    },
    {
      "id": "2a6c5f58-7d9f-472b-9820-44458387b2d1",
      "name": "Charizard",
      "type": 2,
      "power": 84,
      "life": 78,
      "image": "https://example.com/charizard.png"
    }
  ]
}
```

### GET /api/type-factor/:type1/:type2

Retrieve the effectiveness factor between two Pokémon types.

- **URL**: `/api/type-factor/:type1/:type2`
- **Method**: `GET`
- **URL Parameters**:
  - `type1` (string): The name of the first Pokémon type.
  - `type2` (string): The name of the second Pokémon type.
- **Response**: An object containing the effectiveness factor.

#### Example Request

```bash
GET /api/type-factor/Water/Fire
```

#### Example Response

```json
{
  "factor": 2
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
- `team`: Stores team data (id, name)
- `team_pokemon`: Stores the relationship between teams and Pokémon
- `weakness`: Stores type effectiveness data

### Environment Variables

The application uses dotenv to manage environment variables. Ensure your `.env` file is properly configured and located in the root directory.

### Concurrent Development

The project uses `concurrently` to run both the server and client simultaneously during development. This is configured in the `scripts` section of `package.json`.

---

## Contact

For any questions or feedback, please contact mohamed.aleya@outlook.com.

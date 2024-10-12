## POKEMON API Endpoints

### Get All Pokemon

- **URL**: `/api/pokemon`
- **Method**: `GET`
- **Description**: Retrieves a list of all Pokemon with their details.
- **Response**: An array of Pokemon objects, each containing:
  - `id`: UUID
  - `name`: String
  - `image`: String (URL)
  - `power`: Number
  - `life`: Number
  - `typeName`: String

### Get Pokemon by Name

- **URL**: `/api/pokemon/:name`
- **Method**: `GET`
- **Description**: Retrieves details of a specific Pokemon by its name.
- **URL Params**: `name` (case-insensitive)
- **Response**: A Pokemon object containing:
  - `id`: UUID
  - `name`: String
  - `image`: String (URL)
  - `power`: Number
  - `life`: Number
  - `typeName`: String

## Error Handling

The API uses standard HTTP response codes to indicate the success or failure of requests:

- 200 OK: The request was successful.
- 404 Not Found: The requested resource was not found.
- 500 Internal Server Error: An error occurred on the server.

In case of an error, the response will include a JSON object with an `error` field containing a description of the error.

# Premier Quidditch League API Documentation

# Table of Contents

1. [Overview](#overview)
2. [Base URL](#base-url)
3. [Resources](#resources)
   - [Get Available Players](#get-all-available-players)
   - [Creating Teams](#creating-teams)
     - [Errors for Creating Teams](#possible-error-responses-for-post-teams)
4. [Other Available Resources](#other-available-resources)
   - [Teams](#teams)
   - [Players](#players)


## Overview

This API provides access to manage teams and players within the Premier Quidditch League. It enables the creation of teams, assignment of players to teams, and retrieval of available players who are not yet assigned to any team.

## Base URL

http://localhost:3001/api

## Resources

### Get All Available Players

Retrieves a list of players who are currently unassigned to any team.

- **URL**
  
  /api/players/available

- **Method**

  GET

- **Success Response:**
  - **Code:** 200 
  - **Content:** 
  
  ```json
  [
    {
      "id": 4,
      "name": "Draco Malfoy",
      "age": 11,
      "position": "Chaser",
      "team_id": 33563
    }
  ]
  ```

- **Error Response:**
  - **Code:** 500 INTERNAL SERVER ERROR 
  - **Content:** `{ "error" : "Error message" }`

- **Sample Call:**

  ```bash
  curl -X GET http://localhost:3001/api/players/available/
  ```


### Creating teams

Creates a new team and assigns players to the team. It returns an error if any player is already assigned to another team or does not exist.

- **URL**

  /api/teams

- **Method:**

  POST

- **Data Params**

  Required:
  ```json
  {
    "name": "Team 1",
    "slogan": "Slogan 1",
    "players": [1, 2, 3]
  }
  ```

- **Success Response:**
  - **Code:** 201 CREATED

- **Content:**
  ```json
  {
    "message": "Team created successfully"
  }
  ```

- **Error Response:**
  
  - **Code:**
    400 BAD REQUEST
  - **Content:**
    `{ "message" : "Name is required" }`
  OR
  - **Code:**
    500 INTERNAL SERVER ERROR
  - **Content:**
    `{ "message" : "Error message" }`

#### Possible Error Responses for POST /teams

- **Missing Required Fields**
  - **Code:** 400 BAD REQUEST
  - **Content:** `{ "message" : "Name is required" }`
  - **Description:** This error occurs when the required `name` field is not provided in the request body.

- **Player Not Found**
  - **Code:** 404 NOT FOUND
  - **Content:** `{ "message" : "Player with id [id] not found" }`
  - **Description:** This error is returned when one or more player IDs provided in the `players` array do not correspond to any existing player records.

- **Player Already Assigned**
  - **Code:** 400 BAD REQUEST
  - **Content:** `{ "message" : "Player with id [id] is already in a team" }`
  - **Description:** This error occurs if a player is already assigned to another team, preventing them from being reassigned.

- **Database Error**
  - **Code:** 500 INTERNAL SERVER ERROR
  - **Content:** `{ "message" : "Database error occurred" }`
  - **Description:** A generic error message for any unexpected database errors that prevent the team from being created or players from being updated.

- **Team Creation Failed**
  - **Code:** 500 INTERNAL SERVER ERROR
  - **Content:** `{ "message" : "Error creating team" }`
  - **Description:** This error indicates that despite valid input, the server failed to create a new team due to an internal issue.

- **Sample Call:**
  ```bash
  curl -X POST http://localhost:3001/api/teams \
  -H "Content-Type: application/json" \
  -d '{"name": "Team 1", "slogan": "Slogan 1", "players": [1, 2, 3]}'
  ```


## Other Available Resources

JSON Server automatically provides standard CRUD operations for all entities defined in the `db.json`. Below are the endpoints available for the `teams` and `players` entities.

### Teams

- **GET /teams**
  - Retrieves a list of all teams.
  - **Sample Call:**
    ```bash
    curl -X GET http://localhost:3001/api/teams
    ```

- **GET /teams/{id}**
  - Retrieves a team by its ID.
  - **Sample Call:**
    ```bash
    curl -X GET http://localhost:3001/api/teams/1
    ```

- **POST /teams**
  - Creates a new team. (Detailed in the custom POST endpoint section)
  
- **PUT /teams/{id}**
  - Updates an existing team by ID.
  - **Sample Call:**
    ```bash
    curl -X PUT http://localhost:3001/api/teams/1 -H "Content-Type: application/json" -d '{"name": "Updated Name", "slogan": "Updated Slogan"}'
    ```

- **DELETE /teams/{id}**
  - Deletes a team by ID.
  - **Sample Call:**
    ```bash
    curl -X DELETE http://localhost:3001/api/teams/1
    ```

### Players

- **GET /players**
  - Retrieves a list of all players.
  - **Sample Call:**
    ```bash
    curl -X GET http://localhost:3001/api/players
    ```

- **GET /players/{id}**
  - Retrieves a player by ID.
  - **Sample Call:**
    ```bash
    curl -X GET http://localhost:3001/api/players/1
    ```

- **POST /players**
  - Creates a new player.
  - **Sample Call:**
    ```bash
    curl -X POST http://localhost:3001/api/players -H "Content-Type: application/json" -d '{"name": "New Player", "age": 12, "position": "Seeker"}'
    ```

- **PUT /players/{id}**
  - Updates an existing player by ID.
  - **Sample Call:**
    ```bash
    curl -X PUT http://localhost:3001/api/players/1 -H "Content-Type: application/json" -d '{"name": "Updated Player", "age": 13}'
    ```

- **DELETE /players/{id}**
  - Deletes a player by ID.
  - **Sample Call:**
    ```bash
    curl -X DELETE http://localhost:3001/api/players/1
    ```

These endpoints allow for full control over team and player data via standard RESTful API operations.


# Social Media Backend

This repository contains the backend code for a social media application. It provides APIs to manage user registration, login, profile updates, messaging, and more.

## Features

The implemented features of the app include:

- User registration: Allows users to create an account with a unique username and email.
- User login: Authenticates users with their username and password.
- Profile updates: Allows users to update their username, email, and password.
- Messaging: Enables users to send and receive messages to/from other users.
- Reveal and Open Modes: Implements a reveal mode where users can choose to reveal their profile information, and an open mode where users can view the profiles of other users who have enabled reveal mode.

## Setup and Usage

To set up and run the app, follow these instructions:

1. Clone the repository:

```bash
  git clone https://github.com/TechSpiritSS/Social_Media_Backend.git
```
2. Install dependencies:

``` bash
  cd Social_Media_Backend
  npm install
```

3. Configure the environment variables:
- Create a .env file in the root directory of the project. (Providing sample .env file)
- Specify the required environment variables in the .env file, such as the database connection URL, JWT secret key, etc.

4. Start the server:
``` bash
  npm start
```

This will start the server on the specified port. You should see a message indicating that the server is running.
Use an API testing tool like Postman or ThunderClient to interact with the APIs.

## Assumptions and Additional Libraries

- This project assumes the usage of MongoDB as the database. Please ensure that you have MongoDB installed and running.
- The project uses the Express.js framework for building the RESTful API endpoints.
- If you are looking for SQL varient as Database check my other project repo - [link](https://github.com/TechSpiritSS/Mood-Messenger/blob/master/server/controllers/messageController.js)

### Additional libraries used in this project include:
- Mongoose: For MongoDB object modeling and interaction.
- Bcrypt: For password hashing.
- JWT: For authentication and token-based access control.
- Body-parser: For parsing request bodies.
- Nodemon (dev dependency): For automatic server restart during development.

## Usage

### User Registration:
```vbnet
Endpoint: POST /api/auth/register
Description: Register a new user
Payload:
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
Response:
{
  "status": true,
  "user": {
    "username": "john_doe",
    "_id": "648063db04e93edfa7c39dbf"
  }
}
```
### User Login:
``` vbnet
Endpoint: POST /api/auth/login
Description: Log in an existing user
Payload:
{
  "username": "john_doe",
  "password": "password123"
}
Response:
{
  "status": true,
  "user": {
    "username": "john_doe",
    "_id": "648063db04e93edfa7c39dbf"
  }
}
```

### Update Profile:
```
Endpoint: PUT /api/auth/update/:id
Description: Update user profile
Params: 
- id: The ID of the user
Payload:
{
  "username": "john_doe_updated",
  "email": "john@example.com",
  "revealMode": true,
}
Response:
{
  "status": true,
  "user": {
    "username": "john_doe_updated",
    "email": "john@example.com",
    "_id": "648063db04e93edfa7c39dbf",
    "revealMode": true,
    "openMode": false
  }
}
```

### Get All Users:
``` vbnet
Endpoint: GET /api/auth/allUsers/:id
Description: Get all users (from admin account)
Params: 
- id: The ID of the user
Response:
{
  "status": true,
  "users": [
  {
    "_id": "6480652b7d34d5ff2593e41b",
    "username": "c_doe",
    "email": "doe.doe@example.com"
  },
  {
    "_id": "648063db04e93edfa7c39dbf",
    "username": "john_doe",
    "email": "john.doe@example.com"
  }
]
}

Endpoint: GET /api/auth/allUsers/:id
Description: Get all users (from open)
Params: 
- id: The ID of the user
Response:
{
  "status": true,
  "users": [
  {
    "_id": "6480652b7d34d5ff2593e41b",
    "username": "c_doe",
    "email": "doe.doe@example.com" //Only in Reveal Checked Users
  },
  {
    "_id": "648063db04e93edfa7c39dbf",
    "username": "john_doe",
  }
]
}

Endpoint: GET /api/auth/allUsers/:id
Description: Get all users (from open unchecked)
Params: 
- id: The ID of the user
Response:
{
  "status": true,
  "users": [
  {
    "_id": "6480652b7d34d5ff2593e41b",
    "username": "c_doe",
  },
  {
    "_id": "648063db04e93edfa7c39dbf",
    "username": "john_doe",
  }
]
}
```

### Update Open Status:
``` vbnet
Endpoint: PUT /api/auth/updateOpenStatus/:userId
Description: Update open status for a user (Admin Only API)
Params: 
- id: The ID of the user to make changes
{
  "openMode": true
}
Response:
{
  "status": true,
  "message": "Open status updated successfully"
}
```
### Make User Admin
``` vbnet
Endpoint: PUT /api/auth/makeUserAdmin/:id
Description: Make a user an admin
Params:
- id: The ID of the user to make admin
Response:
{
  "status": true,
  "message": "User successfully made admin"
}
```

## Get Chat Message
```vbnet
Endpoint: POST /api/messages/getmsg
Description: Get all messages of current chat
Request Body:
{
  "to": "6480652b7d34d5ff2593e41b",
  "from": "6480652b7d34d5ff2593e41b"
}

Response:
[
  {
    "fromSelf": false,
    "message": "Hello, how are you?",
    "time": "2023-06-07T14:12:20.999Z"
  },
  {
    "fromSelf": true,
    "message": "I'm doing great, thanks! How about you?",
    "time": "2023-06-07T14:15:45.214Z"
  }
]
```

### Send Message
```vbnet
Endpoint: POST /api/messages/getmsg
Description: Add message to current chat
Request Body:
{
  "message": "Sure, take your time. Looking forward to it!",
  "to": "6480652b7d34d5ff2593e41b",
  "from": "6480652b7d34d5ff2593e41b"
}
Response:
{
  "msg": " Message added successfully"
}

```

# Plann.er Backend

This is the backend for the Plann.er project, a Trip Planner created during the NLW Journey event by Rocketseat, in the Node.js track. We used Node.js with technologies like Fastify, Zod, Prisma, Dayjs, and Nodemailer, all with TypeScript.

## Overview

This project allows you to create travel plans with start and end dates, add participants, and manage activities and links related to the trip.

## Prerequisites

Make sure you have the following software installed on your system:
- [Node.js](https://nodejs.org/) (which includes npm)
- [Git](https://git-scm.com/)

## Setup

Follow these steps to set up and run the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/UsgMathe/plann.er-backend.git
cd plann.er-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the .env file

Create a `.env` file in the root of the project with the following content:

```env
DATABASE_URL="file:./dev.db"
API_BASE_URL="http://localhost:your_port"
WEB_BASE_URL="frontend_url"
PORT=desired_port
```

### 4. Run the development server

```bash
npm run dev
```

This will start the development server in `DATABASE_URL`.

## Routes

### Create Trip

- **Method:** POST
- **URL:** `{{ DATABASE_URL }}/trips`
- **Body:**
  ```json
  {
    "destination": "Destination",
    "starts_at": "2024-07-18 07:30:00",
    "ends_at": "2024-07-27 18:00:00",
    "owner_name": "name",
    "owner_email": "email@email.com",
    "emails_to_invite": ["test@hotmail.com", "planner@teste.com"]
  }
  ```

### Update Trip

- **Method:** PUT
- **URL:** `{{ DATABASE_URL }}/trips/:trip_id`
- **Body:**
  ```json
  {
    "destination": "Destination",
    "starts_at": "2024-07-18 07:30:00",
    "ends_at": "2024-07-27 18:00:00"
  }
  ```

### Get Trip Details

- **Method:** GET
- **URL:** `{{ DATABASE_URL }}/trips/:trip_id`

### Get Trips

- **Method:** GET
- **URL:** `{{ DATABASE_URL }}/trips`

### Confirm Trip

- **Method:** GET
- **URL:** `{{ DATABASE_URL }}/trips/:trip_id/confirm`

### Create Invite

- **Method:** POST
- **URL:** `{{ DATABASE_URL }}/trips/:trip_id/invites`
- **Body:**
  ```json
  {
    "email": "test@outlook.com"
  }
  ```

### Get Participants

- **Method:** GET
- **URL:** `{{ DATABASE_URL }}/trips/:trip_id/participants`

### Get Participant

- **Method:** GET
- **URL:** `{{ DATABASE_URL }}/participants/:participant_id`

### Confirm Participant

- **Method:** GET
- **URL:** `{{ DATABASE_URL }}/participants/:participant_id/confirm`

### Create Trip Activity

- **Method:** POST
- **URL:** `{{ DATABASE_URL }}/trips/:trip_id/activities`
- **Body:**
  ```json
  {
    "title": "Coffe",
    "occours_at": "2024-07-27 05:50"
  }
  ```

### Get Trip Activities

- **Method:** GET
- **URL:** `{{ DATABASE_URL }}/trips/:trip_id/activities`

### Create Trip Link

- **Method:** POST
- **URL:** `{{ DATABASE_URL }}/trips/:trip_id/links`
- **Body:**
  ```json
  {
    "title": "Trip Playlist",
    "url": "https://open.spotify.com/playlist/6E833f42r1aCkmJFipyl5Q?si=74bd776d3aee4231"
  }
  ```

### Get Trip Links

- **Method:** GET
- **URL:** `{{ DATABASE_URL }}/trips/:trip_id/links`

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Fastify](https://www.fastify.io/)
- [Zod](https://zod.dev/)
- [Prisma](https://www.prisma.io/)
- [Dayjs](https://day.js.org/)
- [Nodemailer](https://nodemailer.com/about/)
- [TypeScript](https://www.typescriptlang.org/)

---

I hope this documentation is clear and helps with the setup and execution of the project!

# Event Management System

## Overview

A comprehensive system to manage events, attendees, and registrations with advanced features such as caching and background jobs for efficient operations.

---

## Features

### Event Management

- **CRUD Operations**: Create and read operations for events.
- **Validation**:
  - `max_attendees` must be a positive integer.
  - Prevent overlapping events by validating the event dates.

### Attendee Management

- **CRUD Operations**: Create and read operations for attendees.
- **Validation**:
  - Ensure unique emails for all attendees.

### Registration Management

- **Functionalities**:
  - Register attendees for specific events.
  - Ensure registrations do not exceed `max_attendees`.
  - Prevent duplicate registrations for the same event.
  - List all registrations for an event, including attendee details.

### Search and Filters

- **Filters**:
  - Filter events by date.
- **Search**:
  - Search attendees by name or email.

---

## Advanced Features

### Caching

- Cached frequently accessed data such as event lists.
- Used **Redis** caching with a **TTL policy** for efficient data retrieval.

### Background Jobs

- Send confirmation emails to attendees after successful registration.
- Use a job queue like **BullJS** to handle email notifications asynchronously.

---

## Installation and Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/pollabd/event-management-system.git
   cd event-management-system
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Environment Variables**:
   All Basic/ Default env has been included that comes with docker . A sample env has been provided aswell. Also docker compose containes all default env.

   **_Note - Make sure docker running postgresql and redis if you run this App seperately_**

4. **Start the Application**:
   ```bash
   npm start
   ```

---

## Run with docker

```bash
# docker compose command
$ docker-compose up --build -d
```

---

## API Endpoints

### Events

- `POST /events`: Create a new event.
- `GET /events`: Retrieve all events.
- `GET /events/:id`: Retrieve a specific event.
- `DELETE /events/:id`: Delete a specific event.
- `GET /events/filter/by-date`: Filter a specific event by date.

### Attendees

- `POST /attendees`: Register a new attendee.
- `GET /attendees`: Retrieve all attendees.
- `GET /attendees/:id`: Retrieve a specific attendee.
- `DELETE /attendees/:id`: Delete a specific attendee.
- `GET /attendees/search`: Search a specific attendee by name or email.

### Registrations

- `POST /registrations/events/:eventId/attendees/:attendeeId`: Register an attendee for an event.
- `GET /registrations/events/:eventId`: List all registrations for an event.
- `Delete /registrations/:eventId/attendees/:attendeeId/cancel`: Cancle registrations for an event.

---

## Technologies Used

- **Backend**: NestJS
- **Database**: PostgreSQL
- **Caching**: Redis
- **Job Queue**: BullJS
- **Email Service**: Mailer

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

For questions or support, please contact [rudraoff7@gmail.com].

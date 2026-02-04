# API Documentation

## Authentication
All endpoints requiring authentication expect a Bearer Token in the Authorization header.
`Authorization: Bearer <token>`

## Bookings

### Create Booking
**POST** `/bookings`
- **Auth**: Required (Customer)
- **Body**:
  ```json
  {
    "propertyId": "string (ObjectId)",
    "roomId": "string (ObjectId)",
    "checkIn": "YYYY-MM-DD",
    "checkOut": "YYYY-MM-DD"
  }
  ```
- **Response**: 201 Created
  ```json
  {
    "success": true,
    "data": { ...bookingObject }
  }
  ```
- **Errors**:
  - 409 Conflict: "No rooms available for the selected dates"
  - 400 Bad Request: Invalid dates or inputs

### Get Customer Bookings
**GET** `/bookings/mine`
- **Auth**: Required
- **Response**: 200 OK
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "...",
        "propertyName": "...",
        "roomType": "...",
        "dates": { "checkIn": "...", "checkOut": "..." },
        "price": 100
      }
    ]
  }
  ```

### Get Owner Bookings
**GET** `/bookings/owner`
- **Auth**: Required (Owner)
- **Response**: 200 OK
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "...",
        "propertyName": "...",
        "customerEmail": "...",
        "roomType": "...",
        "dates": { "checkIn": "...", "checkOut": "..." },
        "status": "confirmed"
      }
    ]
  }
  ```

## Properties

### Create Property
**POST** `/properties`
- **Auth**: Required (Owner)

### Get Public Properties
**GET** `/properties`
- **Auth**: None

### Get Owner Properties
**GET** `/properties/mine`
- **Auth**: Required (Owner)

## Admin

### Approve Property
**PATCH** `/admin/properties/:id/approve`
- **Auth**: Required (Admin)

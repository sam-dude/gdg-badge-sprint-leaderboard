# API Documentation

## Base URL

- Development: `http://localhost:3000/api`
- Production: `https://your-app.vercel.app/api`

## Endpoints

### Get All Participants

```
GET /participants
```

Returns all participants with their scores, ordered by points (descending).

**Response:**

```json
{
  "participants": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "googleDevProfileUrl": "https://...",
      "googleSkillsProfileUrl": "https://...",
      "badges": 15,
      "posts": 8,
      "points": 455,
      "lastScraped": "2026-02-03T10:00:00Z",
      "createdAt": "2026-01-01T00:00:00Z",
      "updatedAt": "2026-02-03T10:00:00Z"
    }
  ]
}
```

### Get Single Participant

```
GET /participants/:id
```

**Response:**

```json
{
  "participant": {
    /* same structure as above */
  }
}
```

### Create Participant

```
POST /participants
```

**Body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "badges": 10,
  "posts": 5,
  "googleDevProfileUrl": "https://...",
  "googleSkillsProfileUrl": "https://..."
}
```

**Response:** (201 Created)

```json
{
  "participant": {
    /* participant object */
  }
}
```

### Update Participant

```
PUT /participants/:id
```

**Body:**

```json
{
  "name": "Jane Doe Updated",
  "email": "jane@example.com",
  "badges": 12,
  "posts": 6,
  "googleDevProfileUrl": "https://...",
  "googleSkillsProfileUrl": "https://..."
}
```

**Response:**

```json
{
  "message": "Participant updated successfully",
  "participant": {
    /* updated participant */
  }
}
```

### Delete Participant

```
DELETE /participants/:id
```

**Response:**

```json
{
  "message": "Participant deleted successfully"
}
```

### Batch Create/Update

```
POST /participants/batch
```

**Body:**

```json
{
  "participants": [
    {
      "name": "Person 1",
      "email": "person1@example.com",
      "badges": 5,
      "posts": 3
    },
    {
      "name": "Person 2",
      "email": "person2@example.com",
      "badges": 8,
      "posts": 4
    }
  ]
}
```

**Response:**

```json
{
  "message": "Batch operation completed",
  "results": {
    "created": 1,
    "updated": 1,
    "errors": []
  }
}
```

## Points Calculation

- **Total Points** = (badges × 25) + (posts × 10)

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

```json
{
  "error": "Error message description"
}
```

Common status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

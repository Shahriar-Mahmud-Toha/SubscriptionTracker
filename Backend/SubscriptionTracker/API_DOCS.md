# Subscription Tracker API Documentation

This API enables secure user registration, authentication, profile management, and full CRUD operations for subscriptions, with robust JWT-based authentication and automated email notifications for expiring or soon-to-expire subscriptions.

---

## Authentication & User Management

---

### 1. **User Signup**

**Endpoint:** `/api/user/signup`  
**Method:** `POST`  
**Description:** Register a new user account. Triggers an email verification link.

**Request Body Example:**
```json
{
  "email": "john@example.com",
  "password": "Password123!",
  "password_confirmation": "Password123!"
}
```

**Response Example:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "message": "An email verification link has been sent to your email. Please check your inbox and click the link to verify your account."
}
```

**Error Example:**
```json
{
  "email": ["This email is already registered. Please use a different email."]
}
```

**Status Codes:**  
- `201 Created` (Success)  
- `400 Bad Request` (Validation error)  
- `500 Internal Server Error`

---

### 2. **Verify Email (Signup)**

**Endpoint:** `/api/user/signup/verify-email?expires={timestamps}&hash={hash}&id={id}&signature={signature}`  
**Method:** `GET`  
**Description:** Verifies a user's email using the verification link.

**Response Example:**
```json
{
  "message": "Email successfully verified. You can login!"
}
```

**Error Example:**
```json
{
  "message": "Invalid verification link"
}
```

**Status Codes:**  
- `201 Created` (Success)  
- `400 Bad Request`  
- `403 Forbidden`

---

### 3. **Resend SignUp Verification Email**

**Endpoint:** `/api/user/signup/reverifyEmail`  
**Method:** `POST`  
**Description:** Re-sends the email verification link.

**Request Body Example:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response Example:**
```json
{
  "message": "Verification link sent!"
}
```

**Status Codes:**  
- `200 OK`  
- `400 Bad Request`

---

### 4. **User Login**

**Endpoint:** `/api/login`  
**Method:** `POST`  
**Description:** Authenticates a user and returns access and refresh tokens with validity in seconds.

**Request Headers:**
- `X-Client-IP: 127.0.0.1`
- `X-Device-Info: Mozilla/5.0 ...`

**Request Body Example:**
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response Example:**
```json
{
  "tokens": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "access_token_validity": 890,
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    "refresh_token_validity": 3590
  },
  "message": "Login Successful"
}
```

**Error Example:**
```json
{
  "error": "Invalid credentials"
}
```

**Status Codes:**  
- `200 OK`  
- `400 Bad Request`  
- `401 Unauthorized`

---

### 5. **Forgot Password**

**Endpoint:** `/api/user/password/forgot`  
**Method:** `POST`  
**Description:** Sends a password reset link to the user's email.

**Request Body Example:**
```json
{
  "email": "john@example.com"
}
```

**Response Example:**
```json
{
  "message": "Password reset link sent to your email."
}
```

**Status Codes:**  
- `200 OK`  
- `400 Bad Request`

---

### 6. **Reset Password**

**Endpoint:** `/api/user/password/reset`  
**Method:** `POST`  
**Description:** Resets the user's password using the token from the email.

**Request Body Example:**
```json
{
  "token": "reset-token-from-email",
  "password": "NewPassword123!",
  "password_confirmation": "NewPassword123!"
}
```

**Response Example:**
```json
{
  "message": "Password reset successfully!"
}
```

**Error Example:**
```json
{
  "message": "Invalid or expired token."
}
```

**Status Codes:**  
- `200 OK`  
- `400 Bad Request`

---

### 7. **Logout**

**Endpoint:** `/api/logout`  
**Method:** `POST`  
**Headers:**  
- `Authorization: Bearer {access_token}`  
**Description:** Logs out the user and invalidates the token.

**Response Example:**
```json
{
  "message": "Logout Successful"
}
```

**Status Codes:**  
- `200 OK`  
- `403 Forbidden`  
- `500 Internal Server Error`

---

### 8. **Refresh Token**

**Endpoint:** `/api/refresh_token`  
**Method:** `POST`  
**Headers:**  
- `Authorization: Bearer {refresh_token}`  
**Description:** Refreshes the access token using a valid refresh token.

**Response Example:**
```json
{
  "tokens": {   
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "access_token_validity": 890,
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    "refresh_token_validity": 3590
  },
  "message": "Token Refresh Successful"
}
```

**Error Example:**
```json
{
  "error": "Token invalidation failed."
}
```

**Status Codes:**  
- `201 Created`  
- `403 Forbidden`  
- `500 Internal Server Error`

---

### 9. **View Profile**

**Endpoint:** `/api/profile`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer {access_token}`  
**Description:** Returns the authenticated user's profile.

**Response Example:**
```json
{
  "id": 12,
    "role": "user",
    "email": "test@example.com",
    "email_verified_at": "2025-06-15 07:51:58",
    "created_at": "2025-06-10T17:15:13.000000Z",
    "updated_at": "2025-06-15T01:51:58.000000Z",
    "user": {
        "id": 12,
        "auth_id": 12,
        "first_name": "John",
        "last_name": "Example Last Name",
        "dob": "2010-01-28",
        "created_at": "2025-06-12T20:34:17.000000Z",
        "updated_at": "2025-06-12T21:14:10.000000Z"
    }
}
```

**Status Codes:**  
- `200 OK`  
- `500 Internal Server Error`

---

### 10. **Update Email**

**Endpoint:** `/api/update/email`  
**Method:** `PATCH`  
**Headers:**  
- `Authorization: Bearer {access_token}`  
**Description:** Updates the user's email and sends a verification link.

**Request Body Example:**
```json
{
  "email": "newemail@example.com"
}
```

**Response Example:**
```json
{
  "message": "An email verification link has been sent to your email. Please check your inbox and click the link to verify your account."
}
```

**Status Codes:**  
- `200 OK`  
- `400 Bad Request`  
- `500 Internal Server Error`

---

### 11. **Verify Email Update**

**Endpoint:** `/api/user/update/verify-email?expires={timestamps}&hash={hash}&id={id}&signature={signature}&type=update`  
**Method:** `GET`  
**Description:** Verifies the updated email address.

**Response Example:**
```json
{
  "message": "Email successfully verified and Updated."
}
```

**Status Codes:**  
- `201 Created`  
- `400 Bad Request`  
- `403 Forbidden`  
- `500 Internal Server Error`

---

### 12. **Update Password**

**Endpoint:** `/api/update/password`  
**Method:** `PATCH`  
**Headers:**  
- `Authorization: Bearer {access_token}`  
**Description:** Updates the user's password.

**Request Body Example:**
```json
{
  "current_password": "OldPassword123!",
  "password": "NewPassword123!",
  "password_confirmation": "NewPassword123!"
}
```

**Response Example:**
```json
{
  "message": "Password Updated Successfully!"
}
```

**Status Codes:**  
- `200 OK`  
- `400 Bad Request`  
- `500 Internal Server Error`

---

## Subscription Management

---

### 1. **Create Subscription**

**Endpoint:** `/api/subscription/store`  
**Method:** `POST`  
**Headers:**  
- `Authorization: Bearer {access_token}`  
- `Content-Type: multipart/form-data`  
**Description:** Create a new subscription for the authenticated user.  
**Note:** This endpoint accepts `multipart/form-data` (not JSON) and supports file uploads.

**Request Body Example (Form Data):**
- `name`: Netflix
- `seller_info`: Netflix Inc.
- `reminder_time`: 2025-07-01T10:00:00Z
- `date_of_purchase`: 2025-06-01T10:00:00Z
- `duration`: 30
- `date_of_expiration`: 2025-07-01T10:00:00Z
- `account_info`: john@example.com
- `price`: 15.99
- `currency`: USD
- `comment`: Monthly subscription
- `file`: (attach a file, e.g., invoice.pdf)

**Response Example:**
```json
{
    "name": "Disney",
    "seller_info": "Seller 1",
    "date_of_purchase": "2024-12-24T18:00:00.000000Z",
    "reminder_time": "2025-06-15T21:15:00.000000Z",
    "date_of_expiration": "2025-06-15T21:15:00.000000Z",
    "account_info": "test@account.com",
    "price": 1200,
    "currency": "BDT",
    "comment": "All Good.",
    "auth_id": 12,
    "reminder_job_id": "200K7FeSxt3qVexXBSsU4AT9adISYRxG",
    "updated_at": "2025-06-15T17:49:17.000000Z",
    "created_at": "2025-06-15T17:49:17.000000Z",
    "id": 45
}
```

**Error Example:**
```json
{
  "error": "The name field is required."
}
```

**Status Codes:**  
- `201 Created`  
- `400 Bad Request`  
- `404 Not Found`  
- `500 Internal Server Error`

---

### 2. **Update Subscription**

**Endpoint:** `/api/subscription/update/{id}`  
**Method:** `PATCH`  
**Headers:**  
- `Authorization: Bearer {access_token}`  
**Description:** Update an existing subscription.

**Request Body Example:**
```json
{
  "name": "Netflix Premium",
  "reminder_time": "2025-07-01T12:00:00Z"
}
```

**Response Example:**
```json
{
  "message": "Subscription data Updated successfully"
}
```

**Status Codes:**  
- `200 OK`  
- `400 Bad Request`  
- `404 Not Found`  
- `500 Internal Server Error`

---

### 3. **Delete Subscription**

**Endpoint:** `/api/subscription/delete/{id}`  
**Method:** `DELETE`  
**Headers:**  
- `Authorization: Bearer {access_token}`  
**Description:** Delete a subscription.

**Response Example:**
```json
{
  "message": "Subscription deleted successfully"
}
```

**Status Codes:**  
- `200 OK`  
- `404 Not Found`  
- `500 Internal Server Error`

---

### 4. **Show Subscription**

**Endpoint:** `/api/subscription/show/{id}`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer {access_token}`  
**Description:** Get details of a specific subscription.

**Response Example:**
```json
{
    "id": 45,
    "auth_id": 12,
    "name": "Disney",
    "seller_info": "Demo 1",
    "reminder_time": "2025-06-15T21:15:00.000000Z",
    "date_of_purchase": "2024-12-24T18:00:00.000000Z",
    "date_of_expiration": "2025-06-15T21:15:00.000000Z",
    "reminder_job_id": "200K7FeSxt3qVexXBSsU4AT9adISYRxG",
    "account_info": "test@account.com",
    "price": "1200.00",
    "currency": "BDT",
    "comment": "All Good.",
    "file_name": null,
    "created_at": "2025-06-15T17:49:17.000000Z",
    "updated_at": "2025-06-15T17:49:17.000000Z"
}
```

**Status Codes:**  
- `200 OK`  
- `404 Not Found`  
- `500 Internal Server Error`

---

### 5. **Show All Subscriptions for User**

**Endpoint:** `/api/subscription/showAll`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer {access_token}`  
**Description:** Get all subscriptions for the authenticated user.

**Response Example:**
```json
[
  {
    "id": 1,
    "auth_id": 12,
    "name": "Netflix",
    ...
  },
  {
    "id": 2,
    "auth_id": 12,
    "name": "Spotify",
    ...
  }
]
```

**Status Codes:**  
- `200 OK`  
- `404 Not Found`  
- `500 Internal Server Error`

---

### 6. **Search Subscriptions**

**Endpoint:** `/api/subscription/search?keyword={keyword}`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer {access_token}`  
**Description:** Search subscriptions by keyword.

**Response Example:**
```json
[
  {
    "id": 1,
    "name": "Keyword",
    ...
  }
]
```

**Status Codes:**  
- `200 OK`  
- `404 Not Found`  
- `500 Internal Server Error`

---

### 7. **Update Subscription File**

**Endpoint:** `/api/subscription/updateFile/{id}`  
**Method:** `POST`  
**Headers:**  
- `Authorization: Bearer {access_token}`  
- `Content-Type: multipart/form-data`  
**Description:** Update the file attached to a subscription.

**Request Body Example (Form Data):**
- `file`: (file upload)

**Response Example:**
```json
{
  "message": "This Subscription's file updated successfully"
}
```

**Status Codes:**  
- `200 OK`  
- `400 Bad Request`  
- `500 Internal Server Error`

---

## Admin Endpoints (*Under Development)

---

### 1. **Get All Users Count (Admin Only)**

**Endpoint:** `/api/subscription/countAll`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer {access_token}` (admin role)  
**Description:** Get statistics about all users.

**Response Example:**
```json
{
  "data": {
    "total_users": 100,
    "active_users": 90,
    ...
  }
}
```

**Status Codes:**  
- `200 OK`  
- `500 Internal Server Error`

---

### 2. **Get All Subscriptions (Admin Only)**

**Endpoint:** `/api/subscription`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer {access_token}` (admin role)  
**Description:** Get all subscriptions in the system.

**Response Example:**
```json
[
  {
    "id": 1,
    "name": "Netflix",
    ...
  },
  ...
]
```

**Status Codes:**  
- `200 OK`  
- `500 Internal Server Error`

---

## User Profile Management

---

### 1. **Create/Update User Profile**

**Endpoint:** `/api/create` (create), `/api/update` (update)  
**Method:** `POST` (create), `PATCH` (update)  
**Headers:**  
- `Authorization: Bearer {access_token}`  
**Description:** Create or update the user's profile.

**Request Body Example:**
```json
{
    "first_name": "Example",
    "last_name": "Name",
    "dob": "2000-12-25T00:00:00.000000Z"
}
```

**Response Example:**
```json
{
  "message": "User data Updated successfully."
}
```

**Status Codes:**  
- `200 OK`  
- `201 Created`  
- `400 Bad Request`  
- `500 Internal Server Error`

---

## Authentication & Authorization

- All protected endpoints require the `Authorization: Bearer {access_token}` header.
- Custom authentication and authorization middleware is used.
- Rate limiting is enforced on sensitive endpoints (e.g., login, password reset).

---

## Status Codes Summary

| Status Code | Meaning                        |
|-------------|-------------------------------|
| 200         | OK / Success                   |
| 201         | Created                        |
| 400         | Bad Request / Validation Error |
| 401         | Unauthorized                   |
| 403         | Forbidden                      |
| 404         | Not Found                      |
| 500         | Internal Server Error          |

---

## Notes

- All tokens (access, refresh, password reset, signup, email verify) are time-constrained and will expire.
- Only the official frontend server (CORS-restricted) can access these APIs.
- Automated email notifications and reminders are handled via background jobs and queues.
- Redis is used for fast token refreshing and efficient queue handling.


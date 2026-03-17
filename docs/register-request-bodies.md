# Request bodies for registering all user types

## Postman collection

A full Postman collection with all endpoints and request bodies (including every user type) is in this folder:

- **File:** [`postman-collection.json`](./postman-collection.json)

### How to use

1. Open Postman → **Import** → **Upload Files** → select `docs/postman-collection.json`.
2. Set collection variables (or use defaults):
   - `base_url`: `http://localhost:3000/api`
   - `accessToken`: leave empty; after **Login**, copy `data.accessToken` from the response and paste here (or use a test script to set it).
   - `refreshToken`: same as above from login response.
   - `deviceId`: e.g. `postman-device-1`
   - `userId`: set after creating/getting a user when testing Get/Update/Delete by ID.
3. **Auth flow:** run **Register** or **Login** → copy tokens into collection variables (or use Postman’s “Tests” to auto-save them).
4. **Admin user creation:** under **Users (Admin)** you’ll find:
   - **Create User - Standard (READ_ONLY)**
   - **Create User - Standard (FULL_ACCESS)**
   - **Create User - Practice Admin**
   - **Create User - Super Admin**
   - **Create User (Generic)** (editable template)

---

## 1. Public registration (no auth)

**Endpoint:** `POST /api/auth/register`  
**Auth:** None  
**Creates:** Always a **STANDARD_USER** with **READ_ONLY** permission.

### Request body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

| Field     | Type   | Required | Notes                    |
|----------|--------|----------|--------------------------|
| name     | string | Yes      | Full name                |
| email    | string | Yes      | Valid email, unique      |
| password | string | Yes      | Min 6 characters         |

---

## 2. Admin: create users (all types)

**Endpoint:** `POST /api/users`  
**Auth:** `Authorization: Bearer <accessToken>`  
**Required role:** `SUPER_ADMIN` or `PRACTICE_ADMIN`  
**Required permission:** None for create; `FULL_ACCESS` for listing users.

### 2.1 Standard user (READ_ONLY)

```json
{
  "name": "Standard User",
  "email": "standard@example.com",
  "password": "password123",
  "roleId": "STANDARD_USER",
  "permissions": ["READ_ONLY"],
  "isActive": true
}
```

### 2.2 Standard user (FULL_ACCESS)

```json
{
  "name": "Power User",
  "email": "poweruser@example.com",
  "password": "password123",
  "roleId": "STANDARD_USER",
  "permissions": ["FULL_ACCESS"],
  "isActive": true
}
```

### 2.3 Practice admin

```json
{
  "name": "Practice Admin",
  "email": "practice.admin@example.com",
  "password": "password123",
  "roleId": "PRACTICE_ADMIN",
  "permissions": ["FULL_ACCESS"],
  "isActive": true
}
```

### 2.4 Super admin

```json
{
  "name": "Super Admin",
  "email": "super.admin@example.com",
  "password": "password123",
  "roleId": "SUPER_ADMIN",
  "permissions": ["FULL_ACCESS"],
  "isActive": true
}
```

### 2.5 Minimal body (defaults)

Optional fields can be omitted; defaults apply:

```json
{
  "name": "Minimal User",
  "email": "minimal@example.com",
  "password": "password123",
  "roleId": "STANDARD_USER"
}
```

- `permissions` defaults to `[]` if omitted.  
- `isActive` defaults to `true` if omitted.

---

## Field reference (POST /api/users)

| Field       | Type     | Required | Notes                                              |
|------------|----------|----------|----------------------------------------------------|
| name       | string   | Yes      | Full name                                          |
| email      | string   | Yes      | Valid email, unique                                 |
| password   | string   | Yes      | Min 6 characters                                   |
| roleId     | string   | Yes      | One of: `SUPER_ADMIN`, `PRACTICE_ADMIN`, `STANDARD_USER` |
| permissions| string[] | No       | e.g. `["FULL_ACCESS"]`, `["READ_ONLY"]`, or both   |
| isActive   | boolean  | No       | Default: `true`                                   |

---

## Role and permission values

- **Roles:** `SUPER_ADMIN`, `PRACTICE_ADMIN`, `STANDARD_USER`  
- **Permissions:** `FULL_ACCESS`, `READ_ONLY`  

Ensure these roles (and permissions, if you use a permission collection) exist in the database (e.g. via a seed). If you store `roleId` as a MongoDB Role document `_id` instead of name, use the corresponding role `_id` in `roleId` and ensure the guard receives the role name (e.g. by populating `user.role` or setting the role name in the JWT payload).

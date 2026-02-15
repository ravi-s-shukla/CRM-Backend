# CRM Backend

Lead Management System API with JWT authentication, RBAC, and Socket.IO notifications.

## Requirements

- Node.js 18+
## Setup

```bash
npm install
cp .env.example .env  # copy .env.example file in .env 
```

## Run

```bash
npm run dev
```

Production:

```bash
npm start
```

By default, all registered users are assigned the sales role.
You must manually create Admin and Manager users in the users collection.
OR USE These Credentials for Admin and Manager


===Login Credentials======

============ ADMIN ========
Email:aniket123@gmail.com
Password: admin123

========= Manager =========
Email: vikas123@gmail.com
Password: admin123

# For Sales you can register and login through UI


## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register user |
| POST | /auth/login | Login |
| POST | /auth/logout | Logout |

### Users (admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /users | List users |
| PATCH | /users/:id/role | Update user role |

### Leads

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /leads | List leads (paginated) |
| GET | /leads/stats/summary | Dashboard stats |
| GET | /leads/:id | Get lead |
| POST | /leads | Create lead |
| PATCH | /leads/:id | Update lead |
| DELETE | /leads/:id | Delete lead |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /notifications | List notifications |
| PATCH | /notifications/:id/read | Mark as read |

## List API Query Params

- `q` - Search (name, email, phone)
- `status` - Filter by status
- `source` - Filter by source
- `assignedTo` - Filter by assignee (manager/admin)
- `createdFrom` - ISO date
- `createdTo` - ISO date
- `sort` - field:order (e.g. createdAt:desc)
- `page` - Page number
- `limit` - Items per page (max 100)

## RBAC

| Role | Permissions |
|------|-------------|
| admin | Full access |
| manager | Leads, dashboard, user read, notifications |
| sales | Own/assigned leads only, own notifications |

## Socket.IO

Connect with JWT in `auth.token` or `Authorization: Bearer <token>`. Joins room `user:{userId}` for notifications on lead create, assign, status change, delete.

## Project Structure

```
src/
  config/      - Database
  constants/   - Roles, permissions
  controllers/ - Request handlers
  middleware/  - Auth, RBAC, validate, error
  models/      - Mongoose schemas
  routes/      - Express routes
  services/    - Business logic
  socket/      - Socket.IO setup
  utils/       - asyncHandler, apiResponse
  validators/  - Joi schemas
```

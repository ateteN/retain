# Retain  
### Personal Expense & Budget Management Platform

**Retain** is a full stack web application that helps you monitor your spending and amanage your budget. It was build using React, Express, Typescript, and MongoDB. The app will help analyse your spending habits, and the app also has administrative controls for admin users. 

---

## Live Demo

- **Web Application URL:** [https://retain-dun.vercel.app/](https://retain-dun.vercel.app/)
- **API Base URL:** [https://retain-26pk.vercel.app/api](https://retain-26pk.vercel.app/api) *(Local development: `http://localhost:5000/api`)*

---

## Demo Credentials

You can test the application using the pre-seeded demo accounts or create a new personal account via the `/signup` page.

| Role              | Email              | Password        | Access Level |
|-------------------|--------------------|-----------------|----------------------------------------------|
| **Administrator** | `admin@retain.app` | `AdminPass123!` | System Insights, User Metrics, Category CRUD |
| **Standard User** | `test@example.com` | `password123`   | Personal Expenses, Budget, Dashboard         |

---

## Main Features

- **Authentication & Role-Based Access Control:** You can securely create accounts and log in. Passwords are protected using bcrypt hashing and JWT tokens keep users authenticated. The system also separates regular user permissions from administrator access.
- **Expense Management (CRUD):** You can add, view, edit, and delete your transactions. Each transaction can include a title, amount, date, payment method, category, and optional notes
- **Search, Filtering & Sorting:** You can quickly find specific transactions by searching for keywords or filtering by category, payment method, or date range. You can also sort transactions by date or amount, in either ascending or descending order.
- **Server-Side Pagination:** Loads transactions in smaller pages instead of fetching everything at once, this helps to keep the application fast even when users have many transactions.
- **Monthly Budget Tracking and Alerts:** Allows users to set monthly spending limits and track their progress. The system shows whether they are within budget, approaching their limit (90% or more spent), over budget, or have not set a budget: `WITHIN_BUDGET`, `APPROACHING_BUDGET` (≥ 90%), `OVER_BUDGET`, and `NO_BUDGET_SET`.
- **Interactive Dashboard:** Gives users a clear overview of their finances, including monthly spending, remaining budget, biggest expenses, recent transactions, and spending by category.
- **Category Management with Safe Deletion:** Lets users create and manage spending categories. When a custom category is deleted, any transactions assigned to it are automatically moved to the `Uncategorized category` instead of being left without a category.
- **Administrator Insights Console:** Provides admins with an overview of platform activity, including the total number of users, total transactions, monthly activity, most and least used categories, and recently registered users.
- **Session Handling & Route Protection:** Automatically attaches JWT tokens to API requests to keep users authenticated. If a session expires or the server returns a 401 error, the system clears the saved session data and redirects the user to the login page.

---

## Technologies Used

### Frontend
- **Framework & Runtime:** React 19 (`react`, `react-dom`)
- **Language:** TypeScript
- **Routing:** React Router v7 (`react-router-dom`)
- **State Management:** Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **HTTP Client:** Axios with request and response interceptors
- **Build Tool & Bundler:** Vite 8
- **Styling:** Modular CSS (CSS Modules) & Vanilla CSS design system

### Backend
- **Runtime Environment:** Node.js
- **Framework:** Express 5 (`express`)
- **Language:** TypeScript
- **Database ODM:** Mongoose 9 (`mongoose`)
- **Security & Utilities:** `jsonwebtoken` (JWT), `bcryptjs`, `cors`, `cookie-parser`, `dotenv`
- **Development Server:** `ts-node-dev`

### Database
- **Engine:** MongoDB (hosted on MongoDB Atlas)

### Hosting & Deployment
- **Frontend Hosting:** Vercel
- **Backend API Hosting:** Vercel Serverless Functions 
- **Version Control:** Git & GitHub

### Development & Code Quality
- **Type Checking:** TypeScript Compiler (`tsc`)
- **Linting:** ESLint 10 (`eslint`, `@typescript-eslint`)

---

## Setup Instructions

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js:** `v18.0.0` or higher (Recommended: `v20.x` or `v22.x`)
- **npm:** `v9.0.0` or higher
- **MongoDB:** A running local MongoDB daemon (`mongodb://localhost:27017/retain`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) connection string
- **Git:** `v2.x` or higher

Check your versions:
```bash
node -v
npm -v
git --version
```

---

### 1. Clone the Repository

```bash
git clone https://github.com/ateteN/retain.git
cd retain
```

---

### 2. Install Dependencies

Retain is structured as a two-tier application with separate `client` and `server` folders. Install dependencies for both:

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Return to root directory
cd ..
```

---

### 3. Environment Variables

Both `server` and `client` require configuration files.

#### Backend (`server/.env`)

Create `server/.env` by copying `server/.env.example`:

```bash
cd server
cp .env.example .env
```

Configure the following variables in `server/.env`:

| Variable | Purpose | Example Placeholder Value |
|---|---|---|
| `MONGODB_URI` | MongoDB connection URI string | `mongodb+srv://<user>:<password>@cluster0.mongodb.net/retain` *(or `mongodb://localhost:27017/retain`)* |
| `PORT` | Local port for Express API server | `5000` |
| `JWT_SECRET` | Secret key used to sign and verify JSON Web Tokens | `your-random-secret-string-at-least-32-chars` |
| `JWT_EXPIRES_IN` | Token validity duration | `7d` |
| `CLIENT_ORIGIN` | Allowed origin for Cross-Origin Resource Sharing (CORS) | `http://localhost:5173` |

#### Frontend (`client/.env`)
Create `client/.env`:

```bash
cd ../client
touch .env
```

Configure the following variable in `client/.env`:

| Variable | Purpose | Example Placeholder Value |
|---|---|---|
| `VITE_API_BASE_URL` | Base endpoint URL for client HTTP requests | `http://localhost:5000/api` |

---

### 4. Database Setup & Seeding

Run the seed script to create the initial admin user account and set up the default `Uncategorized` category:

```bash
cd ../server
npm run seed
```

This will output:
```text
Connected for seeding...
Admin ready: admin@retain.app / AdminPass123!
Default category ready: Uncategorized
Seeding complete.
```

---

### 5. Running the Application

#### Development Mode

Run the backend and frontend in separate terminal windows:

**Terminal 1 (Backend Server):**
```bash
cd server
npm run dev
```
*The API will start at `http://localhost:5000` with hot-reload enabled.*

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
```
*The Vite development server will start at `http://localhost:5173`.*

Open [http://localhost:5173](http://localhost:5173) in your browser to use the app.

---

#### Production Mode

To test production builds locally:

**Build and Start Backend:**
```bash
cd server
npm run build
npm start
```

**Build and Preview Frontend:**
```bash
cd client
npm run build
npm run preview
```

---

### 6. Running Tests & Code Quality

Automated unit tests are currently not configured (`server/package.json` contains a default test placeholder). You can run TypeScript checks and linting across the codebase:

```bash
# Type check server
cd server
npm run build

# Lint client code
cd ../client
npm run lint
```

---

## API Documentation

- **Base URL (Local):** `http://localhost:5000/api`
- **Base URL (Production):** `https://retain-26pk.vercel.app/api`

### Authentication Method

All protected endpoints require an HTTP `Authorization` header containing a valid Bearer token issued upon registration or login:

```http
Authorization: Bearer <your_jwt_token>
```

Endpoints marked with **Admin** access require that the decoded token has `role: "admin"`. If a non-admin attempts access, the server responds with HTTP `403 Forbidden`.

---

### Endpoint Summary Table

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Health check endpoint returning server status | No |
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/login` | Authenticate an existing user and obtain a JWT | No |
| `GET` | `/api/expenses` | List user expenses with filtering, search, and pagination | Yes (User) |
| `POST` | `/api/expenses` | Create a new expense record | Yes (User) |
| `GET` | `/api/expenses/:id` | Get details of a specific expense by ID | Yes (User) |
| `PUT` | `/api/expenses/:id` | Update an existing expense record | Yes (User) |
| `DELETE` | `/api/expenses/:id` | Delete an existing expense record | Yes (User) |
| `GET` | `/api/budgets/status` | Get monthly budget allowance, total spent, and status | Yes (User) |
| `PUT` | `/api/budgets` | Set or update monthly budget limit | Yes (User) |
| `GET` | `/api/dashboard` | Get high-level monthly dashboard summary and category stats | Yes (User) |
| `GET` | `/api/categories` | Retrieve all expense categories | Yes (User) |
| `POST` | `/api/categories` | Create a new expense category | Yes (Admin) |
| `PUT` | `/api/categories/:id` | Update an existing category | Yes (Admin) |
| `DELETE` | `/api/categories/:id` | Delete a category (reassigns expenses to Uncategorized) | Yes (Admin) |
| `GET` | `/api/admin/insights` | Retrieve system-wide usage, metrics, and activity logs | Yes (Admin) |

---

### Main Endpoint Request & Response Examples

#### 1. User Registration (`POST /api/auth/register`)

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePassword123!"
}
```

**Response (`201 Created`):**
```json
{
  "user": {
    "id": "67138df1234567890abcdef1",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### 2. User Login (`POST /api/auth/login`)

**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "SecurePassword123!"
}
```

**Response (`200 OK`):**
```json
{
  "user": {
    "id": "67138df1234567890abcdef1",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### 3. Create Expense (`POST /api/expenses`)

**Headers:**
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Grocery Shopping",
  "amount": 84.50,
  "date": "2026-10-15T14:30:00.000Z",
  "paymentMethod": "card",
  "categoryId": "67138ef4567890abcdef1234",
  "notes": "Weekly produce and household items"
}
```

**Response (`201 Created`):**
```json
{
  "expense": {
    "_id": "671391a9876543210fedcba9",
    "title": "Grocery Shopping",
    "amount": 84.5,
    "date": "2026-10-15T14:30:00.000Z",
    "paymentMethod": "card",
    "notes": "Weekly produce and household items",
    "user": "67138df1234567890abcdef1",
    "category": {
      "_id": "67138ef4567890abcdef1234",
      "name": "Groceries",
      "description": "Supermarket purchases",
      "isDefault": false
    },
    "createdAt": "2026-10-19T10:15:37.000Z",
    "updatedAt": "2026-10-19T10:15:37.000Z"
  }
}
```

---

#### 4. List Expenses (`GET /api/expenses`)

**Query Parameters:**
- `page`: Page number (default: `1`)
- `pageSize`: Items per page (default: `10`, max: `100`)
- `search`: Case-insensitive title regex
- `category`: Category ObjectId
- `paymentMethod`: `cash` | `card` | `mobile_money` | `bank_transfer` | `other`
- `startDate`: ISO date string (filter `>= startDate`)
- `endDate`: ISO date string (filter `<= endDate`)
- `sortBy`: `date` | `amount` (default: `date`)
- `sortOrder`: `asc` | `desc` (default: `desc`)

**Request Example:**
`GET /api/expenses?page=1&pageSize=10&sortBy=date&sortOrder=desc`

**Response (`200 OK`):**
```json
{
  "expenses": [
    {
      "_id": "671391a9876543210fedcba9",
      "title": "Grocery Shopping",
      "amount": 84.5,
      "date": "2026-10-15T14:30:00.000Z",
      "paymentMethod": "card",
      "notes": "Weekly produce and household items",
      "user": "67138df1234567890abcdef1",
      "category": {
        "_id": "67138ef4567890abcdef1234",
        "name": "Groceries",
        "isDefault": false
      },
      "createdAt": "2026-10-19T10:15:37.000Z",
      "updatedAt": "2026-10-19T10:15:37.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

#### 5. Get Budget Status (`GET /api/budgets/status?month=2026-10-01`)

**Response (`200 OK`):**
```json
{
  "month": "2026-10-01",
  "budgetAmount": 500,
  "totalSpent": 320.5,
  "remaining": 179.5,
  "status": "WITHIN_BUDGET"
}
```

---

#### 6. Set Monthly Budget (`PUT /api/budgets`)

**Request Body:**
```json
{
  "amount": 650,
  "month": "2026-10-01"
}
```

**Response (`200 OK`):**
```json
{
  "budget": {
    "_id": "671394f11223344556677889",
    "user": "67138df1234567890abcdef1",
    "month": "2026-10-01T00:00:00.000Z",
    "amount": 650,
    "createdAt": "2026-10-19T10:30:00.000Z",
    "updatedAt": "2026-10-19T10:30:00.000Z"
  }
}
```

---

#### 7. User Dashboard Data (`GET /api/dashboard?month=2026-10-01`)

**Response (`200 OK`):**
```json
{
  "month": "2026-10-01",
  "totalSpent": 320.5,
  "budgetAmount": 650,
  "remainingBudget": 329.5,
  "highestExpense": {
    "_id": "671391a9876543210fedcba9",
    "title": "Grocery Shopping",
    "amount": 84.5,
    "date": "2026-10-15T14:30:00.000Z",
    "category": {
      "name": "Groceries"
    }
  },
  "spendingByCategory": [
    {
      "categoryName": "Groceries",
      "total": 180.5
    },
    {
      "categoryName": "Utilities",
      "total": 140.0
    }
  ],
  "recentExpenses": [
    {
      "_id": "671391a9876543210fedcba9",
      "title": "Grocery Shopping",
      "amount": 84.5,
      "date": "2026-10-15T14:30:00.000Z",
      "category": {
        "name": "Groceries"
      }
    }
  ]
}
```

---

#### 8. Admin Insights (`GET /api/admin/insights`)

**Response (`200 OK`):**
```json
{
  "totalUsers": 12,
  "totalExpenses": 85,
  "totalExpenseValue": 4320.75,
  "expensesThisMonth": 24,
  "spendingByCategory": [
    {
      "categoryId": "67138ef4567890abcdef1234",
      "categoryName": "Groceries",
      "total": 1640.25
    }
  ],
  "mostUsedCategories": [
    {
      "categoryId": "67138ef4567890abcdef1234",
      "categoryName": "Groceries",
      "count": 35
    }
  ],
  "leastUsedCategories": [
    {
      "categoryId": "67139999999999abcdef9999",
      "categoryName": "Entertainment",
      "count": 2
    }
  ],
  "recentExpenses": [],
  "recentUsers": []
}
```

---

## Error Handling

### Standard Server Error Format

All error responses follow a consistent JSON format, making it easier for the frontend to handle errors and display clear messages to users:

```json
{
  "message": "a description of what went wrong."
}
```

### Real Server Error Examples

**Missing Required Fields (`400 Bad Request`):**
```json
{
  "message": "title, amount, date, and paymentMethod are required."
}
```

**Invalid Authentication Token (`401 Unauthorized`):**
```json
{
  "message": "Invalid or expired token."
}
```

**Forbidden Admin Access (`403 Forbidden`):**
```json
{
  "message": "Admin access required."
}
```

**Resource Not Found (`404 Not Found`):**
```json
{
  "message": "Expense not found."
}
```

**Conflict / Duplicate Record (`409 Conflict`):**
```json
{
  "message": "An account with this email already exists."
}
```

**Database Connection Failure (`500 Internal Server Error`):**
```json
{
  "message": "Database connection failed."
}
```

---

### HTTP Status Codes Used

| Status Code | Reason | Typical Cause in Retain |
|---|---|---|
| `200 OK` | Request succeeded | Successful GET, PUT, or DELETE operation |
| `201 Created` | Resource created | Successful registration, category creation, or expense log |
| `400 Bad Request` | Invalid client payload | Missing fields, non-positive amounts, invalid date inputs, or trying to delete default `Uncategorized` |
| `401 Unauthorized` | Authentication failed | Missing Bearer token, invalid token signature, expired token, or incorrect login credentials |
| `403 Forbidden` | Permission denied | Non-admin user attempting to access `/api/admin/*` or category modification endpoints |
| `404 Not Found` | Resource missing | Expense or category ID does not exist, or does not belong to the authenticated user |
| `409 Conflict` | Resource collision | Attempting to register an email already in use or creating a duplicate category name |
| `500 Internal Server Error` | Server failure | MongoDB connection errors or unhandled runtime exceptions caught by `asyncHandler` |

---

### Client-Side Error Interception

The client uses an Axios response interceptor configured in `client/src/api/client.ts`:
1. If any request returns a `401 Unauthorized` status:
   - The user session is automatically invalidated.
   - Authentication tokens (`retain_token`) and user profiles (`retain_user`) are purged from `localStorage`.
   - The user is automatically redirected to `/login` if not already on the login or signup views.
2. In-app validation and API error messages are surfaced to users via contextual alert banners and modal error state displays.

---

## Project Structure

```text
retain/
├── client/                          # React and Vite frontend application
│   ├── public/                      # Static assets (favicons, SVG icons)
│   ├── src/
│   │   ├── api/                     # Axios API clients for auth, expenses, categories, budgets, admin
│   │   ├── assets/                  # Application graphic assets
│   │   ├── components/              # Modular UI components (StatCards, Modals, Badges, Charts)
│   │   ├── context/                 # React Context providers for global state & auth
│   │   ├── pages/                   # Application view pages (Dashboard, Expenses, Budget, Admin, Auth)
│   │   │   ├── Admin/               # Admin metrics and category management
│   │   │   ├── Budget/              # Monthly budget configuration and status tracking
│   │   │   ├── Dashboard/           # Overview metrics, charts, and recent activity
│   │   │   ├── Expenses/            # Expense listing, filtering, pagination, and modal forms
│   │   │   ├── Login/               # User authentication login page
│   │   │   ├── NotFound/            # 404 error page
│   │   │   └── Signup/              # User registration page
│   │   ├── store/                   # Redux Toolkit store slices
│   │   ├── types/                   # TypeScript interfaces, enums, and API payloads
│   │   ├── App.tsx                  # Top-level client routing and protected route wrappers
│   │   ├── index.css                # Global stylesheet and design tokens
│   │   └── main.tsx                 # Client application entry point
│   ├── package.json                 # Frontend dependencies and Vite scripts
│   ├── tsconfig.json                # TypeScript configuration for frontend
│   └── vite.config.ts               # Vite configuration and React plugin
│
├── server/                          # Express and TypeScript backend application
│   ├── api/                         # Serverless entry point for Vercel deployment (`index.ts`)
│   ├── src/
│   │   ├── config/                  # MongoDB connection management (`db.ts`)
│   │   ├── controllers/             # Request handlers for auth, expenses, budgets, categories, admin
│   │   ├── middleware/              # Auth verification (`authenticate`) and role guard (`requireAdmin`)
│   │   ├── models/                  # Mongoose data schemas (User, Expense, Category, Budget)
│   │   ├── routes/                  # Express route routers mounted under `/api/*`
│   │   ├── utils/                   # Utilities (`asyncHandler`, `jwt`, `date` helpers)
│   │   ├── app.ts                   # Express application setup and middleware pipeline
│   │   ├── seed.ts                  # Database seeder script for admin user and default categories
│   │   └── server.ts                # HTTP server bootstrap listener
│   ├── .env.example                 # Environment variable templates for backend
│   ├── package.json                 # Backend dependencies and scripts
│   ├── tsconfig.json                # TypeScript configuration for backend
│   └── vercel.json                  # Vercel serverless routing configuration
│
└── README.md                        # Project documentation and setup guide
```

---

## Contributing & Commit Conventions

Retain uses the Conventional Commits format to keep commit messages clear, consistent, and easy to understand.

```text
<type>(<optional scope>): <short description of the change>
```

### Commit Types Used

- `feat:` Introduces a new feature or endpoint to the application.
- `fix:` Patches a bug or addresses an unexpected behavior.
- `docs:` Documentation modifications only (e.g., updating README or API specs).
- `refactor:` Code restructuring that neither fixes a bug nor adds a feature.
- `style:` Formatting, indentation, or CSS style adjustments.
- `chore:` Dependency upgrades, configuration adjustments, or build script tweaks.

### Examples of Descriptive Commits

- `feat: implement AdminPage with insights and category management`
- `feat: add ExpenseFormModal component with form handling, validation, and styling`
- `refactor: replace custom error handling with asyncHandler in expense and budget routes`
- `fix: resolve category deletion by reassigning linked expenses to default Uncategorized category`

---

All production URLs and evaluation credentials have been configured. If deploying new environments or changing domains, remember to update the corresponding values in `.env` and this documentation.
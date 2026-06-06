# AURUM — CRM + Customer Shop System

A full-stack clothing store platform with a **customer storefront** and an **admin CRM**, built per spec:

- **Backend:** Java 17, Spring Boot 3, Spring Web, Spring Data JPA / Hibernate, Spring Validation, Spring Security + JWT, PostgreSQL, Maven — runs on **http://localhost:8080**
- **Frontend:** React 18, Vite, React Router, Axios, Tailwind CSS, React Hook Form, Context API — runs on **http://localhost:3000**

The two apps are completely independent and talk over a REST API. Database tables are generated automatically by Hibernate (`spring.jpa.hibernate.ddl-auto=update`) on first start.

---

## Prerequisites

- **JDK 17+**
- **Maven 3.9+** (or use your IDE's bundled Maven)
- **Node.js 18+** and npm
- **PostgreSQL 13+** running locally

---

## 1. Database setup

Create a database called `aurum_crm`:

```sql
CREATE DATABASE aurum_crm;
```

Default connection (edit in `backend/src/main/resources/application.properties` if yours differs):

```
url:      jdbc:postgresql://localhost:5432/aurum_crm
username: postgres
password: postgres
```

You do **not** need to create any tables — Hibernate creates them on startup. On the very first run, a set of demo categories, brands, and products is seeded automatically so the storefront has content.

---

## 2. Run the backend (port 8080)

```bash
cd backend
mvn spring-boot:run
```

(or `mvn clean package` then `java -jar target/aurum-crm-1.0.0.jar`)

The API is now at `http://localhost:8080/api`.

---

## 3. Run the frontend (port 3000)

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000**.

The Vite dev server proxies `/api` and `/uploads` to the backend on port 8080, so no extra CORS config is needed during development. (CORS for `http://localhost:3000` is also configured on the backend for direct calls.)

---

## Accounts

### Admin (CRM)
On the login page enter:

```
Login:    ADMIN123
Password: 6789
```

You are redirected to **/admin/dashboard** with full administrative access. This is the built-in default administrator from the spec.

### Customer
Click **Create one** on the login page to register, or register at `/register`. Customers can browse freely, but **checkout requires logging in** — guests are redirected to the login page.

---

## What you can do

**Customer storefront**
- Home with hero, categories, featured / new arrivals / best sellers
- Product listing with search, category filter, and pagination
- Product detail with quantity selector
- Per-user shopping cart (add / update qty / remove, live totals)
- Checkout (delivery details) → order saved as `PENDING`, stock auto-deducted
- Profile: personal info update, password change, order history (all / pending / completed)

**Admin CRM**
- Dashboard: summary cards (products, categories, customers, orders, pending/completed, monthly revenue, low stock) + charts (monthly sales, revenue trend, top sellers, category distribution)
- Products: create / edit / delete / search, image upload, flags for featured/new/best-seller
- Categories: add / edit / delete
- Orders: search, filter by status, expand to view items, update status; **cancelling restores stock**
- Customers: search, view order history, delete
- Inventory: manual stock adjustments, low-stock alerts, full movement log

---

## Project structure

```
aurum/
├── backend/                       Spring Boot REST API (port 8080)
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/aurum/crm/
│       │   ├── config/            Security, CORS, static uploads, data seeder
│       │   ├── controller/        Public + /api/admin REST controllers
│       │   ├── service / impl/    Business logic (layered)
│       │   ├── repository/        Spring Data JPA repositories
│       │   ├── entity/            JPA entities (users, products, orders, …)
│       │   ├── dto/ (request,response)
│       │   ├── mapper/            Entity ↔ DTO mapping
│       │   ├── security/          JWT filter, principal, helpers
│       │   ├── exception/         Global handler + custom exceptions
│       │   └── util/              JwtService
│       └── resources/application.properties
└── frontend/                      React + Vite app (port 3000)
    └── src/
        ├── api/                   Axios client + JWT interceptor
        ├── context/              AuthContext, CartContext
        ├── components/           Navbar, Footer, ProductCard, guards, admin layout
        └── pages/ (+ pages/admin) Storefront + CRM screens
```

---

## Security notes

- Passwords are hashed with **BCrypt**.
- Registered users authenticate via **JWT** (sent as `Authorization: Bearer <token>`).
- Role-based authorization: `/api/admin/**` requires the `ADMIN` role; cart/checkout/profile require authentication.
- Only DTOs are exposed through the API; entities are never returned directly.
- The `aurum.jwt.secret` in `application.properties` is a development value — replace it with your own strong base64 secret for any real deployment.

## Notes & extension points

This implementation covers the full spec's core flows end-to-end. A few spec items are intentionally left as extension points you can build on the existing architecture:
- **Report export to PDF/Excel** — the dashboard aggregations exist; add an export endpoint (e.g. Apache POI for Excel, OpenPDF for PDF).
- **Audit logs** — an `audit_logs` table can be added following the same pattern as `inventory_logs`.
- Customers are modeled as `users` with role `CUSTOMER` (a single `users` table with a role), rather than a separate `customers` table.

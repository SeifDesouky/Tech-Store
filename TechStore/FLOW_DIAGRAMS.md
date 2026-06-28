# Request Flow Diagram

## HTTP Request Flow with Interceptors

```
User Action (e.g., API call)
        ↓
┌───────────────────────────────────────┐
│   1. LOADING INTERCEPTOR              │
│   - Show loading indicator            │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│   2. AUTH INTERCEPTOR                 │
│   - Add Authorization header          │
│   - Attach Bearer token               │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│   HTTP REQUEST SENT TO SERVER         │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│   SERVER RESPONSE                     │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│   3. ERROR INTERCEPTOR                │
│   - Check for errors                  │
│   - Handle 401, 403, 404, 500, etc.   │
│   - Logout if 401                     │
│   - Show error messages               │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│   LOADING INTERCEPTOR (finalize)      │
│   - Hide loading indicator            │
└───────────────────────────────────────┘
        ↓
    Response to Component
```

---

## Route Navigation Flow with Guards

### Accessing Protected Route (e.g., /cart)

```
User navigates to /cart
        ↓
┌───────────────────────────────────────┐
│   AUTH GUARD                          │
│   - Check if user is logged in        │
└───────────────────────────────────────┘
        ↓
    Is Logged In?
        ↓
    YES ──────────────────→ Allow Access to /cart
        ↓
    NO
        ↓
┌───────────────────────────────────────┐
│   Redirect to /login                  │
└───────────────────────────────────────┘
```

---

### Accessing Login Page (when already logged in)

```
Logged-in user navigates to /login
        ↓
┌───────────────────────────────────────┐
│   GUEST GUARD                         │
│   - Check if user is logged in        │
└───────────────────────────────────────┘
        ↓
    Is Logged In?
        ↓
    YES
        ↓
┌───────────────────────────────────────┐
│   Redirect to / (home)                │
└───────────────────────────────────────┘
        ↓
    NO ──────────────────→ Allow Access to /login
```

---

### Accessing Admin Route (e.g., /admin/dashboard)

```
User navigates to /admin/dashboard
        ↓
┌───────────────────────────────────────┐
│   ADMIN GUARD                         │
│   - Check if user is logged in        │
└───────────────────────────────────────┘
        ↓
    Is Logged In?
        ↓
    NO ────────────────→ Redirect to /login
        ↓
    YES
        ↓
┌───────────────────────────────────────┐
│   Check User Role                     │
└───────────────────────────────────────┘
        ↓
    Is Admin?
        ↓
    YES ──────────────→ Allow Access
        ↓
    NO
        ↓
┌───────────────────────────────────────┐
│   Show "Access Denied" Alert          │
│   Redirect to / (home)                │
└───────────────────────────────────────┘
```

---

### Accessing Role-Based Route (e.g., /dashboard with roles: ['admin', 'manager'])

```
User navigates to /dashboard
        ↓
┌───────────────────────────────────────┐
│   ROLE GUARD                          │
│   - Check if user is logged in        │
└───────────────────────────────────────┘
        ↓
    Is Logged In?
        ↓
    NO ────────────────→ Redirect to /login
        ↓
    YES
        ↓
┌───────────────────────────────────────┐
│   Get Required Roles from Route Data  │
│   roles: ['admin', 'manager']         │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│   Get User's Role                     │
│   (from AuthService)                  │
└───────────────────────────────────────┘
        ↓
    User role in required roles?
        ↓
    YES ──────────────→ Allow Access
        ↓
    NO
        ↓
┌───────────────────────────────────────┐
│   Show "Access Denied" Alert          │
│   Redirect to / (home)                │
└───────────────────────────────────────┘
```

---

## Error Handling Flow

```
HTTP Request Fails
        ↓
┌───────────────────────────────────────┐
│   ERROR INTERCEPTOR                   │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│   Determine Error Type                │
└───────────────────────────────────────┘
        ↓
    ┌────────┬────────┬────────┬────────┐
    ↓        ↓        ↓        ↓        ↓
  401      403      404      500     Other
    ↓        ↓        ↓        ↓        ↓
Logout   Access   Not     Server   Custom
         Denied   Found   Error    Message
    ↓        ↓        ↓        ↓        ↓
Redirect  Alert   Error   Error   Error
to Login         Message Message Message
    ↓        ↓        ↓        ↓        ↓
    └────────┴────────┴────────┴────────┘
                    ↓
        ┌───────────────────────────────┐
        │   Log to Console              │
        │   Return Error to Component   │
        └───────────────────────────────┘
```

---

## Authentication Flow

```
User Logs In
        ↓
┌───────────────────────────────────────┐
│   Login Component                     │
│   - Collect credentials               │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│   AuthService.login()                 │
│   - Send POST to /api/users/login     │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│   Server Response                     │
│   { token: "...", user: {...} }       │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│   AuthService.setSession()            │
│   - Save token to localStorage        │
│   - Save user to localStorage         │
│   - Update currentUserSubject         │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│   All Future HTTP Requests            │
│   - Auth Interceptor adds token       │
│   - Header: Authorization: Bearer ... │
└───────────────────────────────────────┘
```

---

## Logout Flow

```
User Clicks Logout
        ↓
┌───────────────────────────────────────┐
│   AuthService.logout()                │
│   - Remove token from localStorage    │
│   - Remove user from localStorage     │
│   - Set currentUserSubject to null    │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│   Navigate to Login Page              │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│   All Future HTTP Requests            │
│   - No token added (not logged in)    │
└───────────────────────────────────────┘
```

---

## Optional: Cache Flow (if enabled)

```
HTTP GET Request
        ↓
┌───────────────────────────────────────┐
│   CACHE INTERCEPTOR                   │
│   - Check if URL is cached            │
└───────────────────────────────────────┘
        ↓
    Is Cached?
        ↓
    YES ──────────────→ Return Cached Response
        ↓                     (Skip Server)
    NO
        ↓
┌───────────────────────────────────────┐
│   Send Request to Server              │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│   Receive Response                    │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│   Cache Response (5 min TTL)          │
└───────────────────────────────────────┘
        ↓
    Return Response
```

---

## Optional: Retry Flow (if enabled)

```
HTTP GET Request
        ↓
┌───────────────────────────────────────┐
│   Send Request                        │
└───────────────────────────────────────┘
        ↓
    Request Failed?
        ↓
    NO ──────────────→ Return Response
        ↓
    YES
        ↓
┌───────────────────────────────────────┐
│   RETRY INTERCEPTOR                   │
│   - Check error type                  │
└───────────────────────────────────────┘
        ↓
    Should Retry?
    (Not 4xx, not 401/403)
        ↓
    NO ──────────────→ Throw Error
        ↓
    YES
        ↓
┌───────────────────────────────────────┐
│   Wait (Exponential Backoff)          │
│   Attempt 1: 1s                       │
│   Attempt 2: 2s                       │
│   Attempt 3: 3s                       │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│   Retry Request                       │
└───────────────────────────────────────┘
        ↓
    Success? ──YES──→ Return Response
        ↓
    NO (Max retries reached)
        ↓
    Throw Error
```

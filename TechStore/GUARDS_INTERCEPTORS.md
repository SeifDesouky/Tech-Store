# Guards and Interceptors Documentation

## Guards

### 1. Auth Guard (`auth.guard.ts`)
**Purpose**: Protects routes that require authentication.

**Usage**:
```typescript
{ path: 'cart', component: CartComponent, canActivate: [authGuard] }
```

**Behavior**:
- Checks if user is logged in
- Redirects to `/login` if not authenticated
- Allows access if authenticated

---

### 2. Guest Guard (`guest.guard.ts`)
**Purpose**: Protects routes that should only be accessible to non-authenticated users.

**Usage**:
```typescript
{ path: 'login', component: LoginComponent, canActivate: [guestGuard] }
```

**Behavior**:
- Checks if user is logged in
- Redirects to `/` (home) if already authenticated
- Allows access if not authenticated

---

### 3. Admin Guard (`admin.guard.ts`)
**Purpose**: Protects routes that require admin privileges.

**Usage**:
```typescript
{ path: 'admin', component: AdminComponent, canActivate: [adminGuard] }
```

**Behavior**:
- Checks if user is logged in
- Checks if user has 'admin' role
- Redirects to `/login` if not authenticated
- Redirects to `/` with alert if not admin

---

### 4. Role Guard (`role.guard.ts`)
**Purpose**: Protects routes based on specific roles.

**Usage**:
```typescript
{ 
  path: 'dashboard', 
  component: DashboardComponent, 
  canActivate: [roleGuard],
  data: { roles: ['admin', 'manager'] }
}
```

**Behavior**:
- Checks if user is logged in
- Checks if user has one of the required roles
- Redirects to `/login` if not authenticated
- Redirects to `/` with alert if role doesn't match

---

## Interceptors

### 1. Auth Interceptor (`auth.interceptor.ts`)
**Purpose**: Automatically adds authentication token to HTTP requests.

**Behavior**:
- Checks if token exists in AuthService
- Adds `Authorization: Bearer <token>` header to all requests
- Passes request through if no token

---

### 2. Error Interceptor (`error.interceptor.ts`)
**Purpose**: Centralized error handling for HTTP requests.

**Behavior**:
- Catches all HTTP errors
- Handles different status codes:
  - **400**: Bad Request
  - **401**: Unauthorized (logs out user, redirects to login)
  - **403**: Forbidden
  - **404**: Not Found
  - **409**: Conflict
  - **422**: Validation Error
  - **500**: Internal Server Error
  - **503**: Service Unavailable
- Logs errors to console for debugging
- Returns formatted error messages

---

### 3. Loading Interceptor (`loading.interceptor.ts`)
**Purpose**: Shows/hides loading indicator during HTTP requests.

**Behavior**:
- Shows loading indicator when request starts
- Hides loading indicator when request completes (success or error)
- Uses LoadingService to manage loading state

---

### 4. Cache Interceptor (`cache.interceptor.ts`)
**Purpose**: Caches GET requests to improve performance.

**Behavior**:
- Only caches GET requests
- Skips caching if `X-Skip-Cache` header is present
- Returns cached response if available and not expired
- Caches new responses for 5 minutes
- Uses CacheService to manage cache

**Usage**:
To skip cache for a specific request:
```typescript
this.http.get(url, { headers: { 'X-Skip-Cache': 'true' } })
```

---

### 5. Retry Interceptor (`retry.interceptor.ts`)
**Purpose**: Automatically retries failed GET requests.

**Behavior**:
- Only retries GET requests
- Retries up to 3 times
- Uses exponential backoff (1s, 2s, 3s)
- Doesn't retry on:
  - Client errors (4xx) except 408 and 429
  - Authentication errors (401, 403)
- Logs retry attempts to console

---

## Interceptor Order

The order of interceptors matters! Current order in `app.config.ts`:

1. **Loading Interceptor** - Shows loading indicator first
2. **Auth Interceptor** - Adds authentication token
3. **Error Interceptor** - Handles errors last

**Note**: Cache and Retry interceptors are available but not registered by default. Add them to `app.config.ts` if needed:

```typescript
provideHttpClient(withInterceptors([
  loadingInterceptor,
  cacheInterceptor,    // Add if you want caching
  retryInterceptor,    // Add if you want auto-retry
  authInterceptor,
  errorInterceptor
]))
```

---

## Services

### LoadingService
Manages loading state for the application.

**Methods**:
- `show()`: Shows loading indicator
- `hide()`: Hides loading indicator
- `loading$`: Observable to subscribe to loading state

**Usage**:
```typescript
constructor(private loadingService: LoadingService) {}

this.loadingService.loading$.subscribe(isLoading => {
  // Update UI based on loading state
});
```

---

### CacheService
Manages HTTP response cache.

**Methods**:
- `get(url: string)`: Get cached response
- `set(url: string, response)`: Cache a response
- `clear()`: Clear all cache
- `clearUrl(url: string)`: Clear specific URL cache

**Usage**:
```typescript
constructor(private cacheService: CacheService) {}

// Clear cache when data is updated
this.cacheService.clearUrl('/api/products');
```

---

## Best Practices

1. **Use appropriate guards**: 
   - Use `authGuard` for protected routes
   - Use `guestGuard` for login/register pages
   - Use `adminGuard` or `roleGuard` for admin pages

2. **Interceptor order matters**:
   - Loading should be first
   - Auth should be before requests are sent
   - Error should be last to catch all errors

3. **Cache wisely**:
   - Only cache data that doesn't change frequently
   - Clear cache when data is updated
   - Use `X-Skip-Cache` header for real-time data

4. **Error handling**:
   - All HTTP errors are centralized
   - User-friendly messages are shown
   - Errors are logged for debugging

5. **Security**:
   - Always use guards on sensitive routes
   - Token is automatically added to requests
   - Unauthorized users are redirected appropriately

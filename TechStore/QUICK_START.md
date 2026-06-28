# Quick Start Guide - Guards & Interceptors

## 🚀 What Was Done

Your TechStore application now has **complete authentication and authorization** with:
- ✅ 4 Guards (auth, admin, role, guest)
- ✅ 5 Interceptors (auth, error, loading, cache, retry)
- ✅ 2 Services (loading, cache)
- ✅ Enhanced error handling
- ✅ Route protection
- ✅ Complete documentation

---

## 📋 Quick Reference

### Using Guards in Routes

```typescript
// Protect a route (requires login)
{ path: 'cart', component: CartComponent, canActivate: [authGuard] }

// Guest only (redirect if logged in)
{ path: 'login', component: LoginComponent, canActivate: [guestGuard] }

// Admin only
{ path: 'admin', component: AdminComponent, canActivate: [adminGuard] }

// Role-based
{ 
  path: 'dashboard', 
  component: DashboardComponent, 
  canActivate: [roleGuard],
  data: { roles: ['admin', 'manager'] }
}
```

---

### Using Services in Components

#### Loading Service
```typescript
import { LoadingService } from './core/services/loading/loading.service';

constructor(private loadingService: LoadingService) {}

ngOnInit() {
  // Subscribe to loading state
  this.loadingService.loading$.subscribe(isLoading => {
    console.log('Loading:', isLoading);
  });
}
```

#### Cache Service
```typescript
import { CacheService } from './core/services/cache/cache.service';

constructor(private cacheService: CacheService) {}

updateProduct() {
  // Clear cache when data changes
  this.cacheService.clearUrl('/api/products');
  // or clear all cache
  this.cacheService.clear();
}
```

---

### Making HTTP Requests

#### Normal Request (with all interceptors)
```typescript
this.http.get('/api/products').subscribe({
  next: (data) => console.log(data),
  error: (err) => console.error(err) // Error interceptor handles this
});
```

#### Skip Cache (if cache interceptor is enabled)
```typescript
this.http.get('/api/products', {
  headers: { 'X-Skip-Cache': 'true' }
}).subscribe(data => console.log(data));
```

---

## 🔧 Current Setup

### Active Interceptors (in app.config.ts)
1. **loadingInterceptor** - Shows/hides loading
2. **authInterceptor** - Adds auth token
3. **errorInterceptor** - Handles errors

### Available but Not Active
- **cacheInterceptor** - Add for caching
- **retryInterceptor** - Add for auto-retry

To activate, edit `src/app/app.config.ts`:
```typescript
provideHttpClient(withInterceptors([
  loadingInterceptor,
  cacheInterceptor,    // Uncomment to enable
  retryInterceptor,    // Uncomment to enable
  authInterceptor,
  errorInterceptor
]))
```

---

## 🛡️ Protected Routes

Currently protected routes:
- `/cart` - Requires authentication
- `/payment` - Requires authentication
- `/support-center/support-ticket` - Requires authentication
- `/support-center/my-ticket` - Requires authentication
- `/login` - Guest only (redirects if logged in)

---

## 🎯 Common Tasks

### Add a New Protected Route
```typescript
// In app.routes.ts
import { authGuard } from './core/guards/auth.guard';

{ 
  path: 'profile', 
  component: ProfileComponent, 
  canActivate: [authGuard] 
}
```

### Add an Admin Route
```typescript
// In app.routes.ts
import { adminGuard } from './core/guards/admin.guard';

{ 
  path: 'admin/users', 
  component: UsersComponent, 
  canActivate: [adminGuard] 
}
```

### Handle Errors in Component
```typescript
this.authService.login(credentials).subscribe({
  next: (response) => {
    // Success - error interceptor won't trigger
    console.log('Logged in!');
  },
  error: (error) => {
    // Error interceptor already handled it
    // Just show the message to user
    alert(error.message);
  }
});
```

---

## 📚 Documentation Files

1. **IMPLEMENTATION_SUMMARY.md** - Complete overview of changes
2. **GUARDS_INTERCEPTORS.md** - Detailed documentation
3. **FLOW_DIAGRAMS.md** - Visual flow diagrams
4. **README.md** - This quick start guide

---

## ✅ Testing Your Setup

### Test Authentication
1. Try to access `/cart` without logging in
   - Should redirect to `/login`
2. Log in
3. Try to access `/cart` again
   - Should work now
4. Try to access `/login` while logged in
   - Should redirect to home

### Test Error Handling
1. Make a request to a non-existent endpoint
   - Should show "Resource not found" error
2. Log out and try to access protected route
   - Should redirect to login

### Test Loading Indicator
1. Make any HTTP request
   - Loading indicator should show
2. When request completes
   - Loading indicator should hide

---

## 🐛 Troubleshooting

### Guards Not Working
- Check that guards are imported in `app.routes.ts`
- Verify `canActivate` array is set correctly
- Check browser console for errors

### Interceptors Not Working
- Verify interceptors are registered in `app.config.ts`
- Check the order of interceptors
- Look for console errors

### Token Not Being Sent
- Verify user is logged in (`authService.isLoggedIn()`)
- Check that token exists in localStorage
- Verify auth interceptor is registered

---

## 🎨 Next Steps

1. **Create Loading Component**
   ```typescript
   // Subscribe to loading service in app component
   this.loadingService.loading$.subscribe(isLoading => {
     // Show/hide spinner
   });
   ```

2. **Replace Alerts with Toast Notifications**
   - Install a toast library (e.g., ngx-toastr)
   - Update error interceptor to use toasts

3. **Add Admin Panel**
   - Create admin components
   - Protect with `adminGuard`
   - Add admin routes

4. **Enable Caching**
   - Add `cacheInterceptor` to `app.config.ts`
   - Test with frequently accessed endpoints

5. **Enable Retry Logic**
   - Add `retryInterceptor` to `app.config.ts`
   - Test with unreliable connections

---

## 💡 Tips

- **Order matters**: Loading should be first, error should be last
- **Guards are chainable**: You can use multiple guards on one route
- **Cache wisely**: Don't cache data that changes frequently
- **Test thoroughly**: Test all protected routes and error scenarios
- **Monitor console**: Errors are logged for debugging

---

## 📞 Need Help?

- Check `GUARDS_INTERCEPTORS.md` for detailed docs
- See `FLOW_DIAGRAMS.md` for visual explanations
- Review `IMPLEMENTATION_SUMMARY.md` for what changed

---

## ✨ Summary

You now have a **production-ready** authentication and authorization system with:
- Secure route protection
- Automatic token management
- Comprehensive error handling
- Loading indicators
- Optional caching and retry logic
- Complete documentation

**Everything is ready to use!** 🎉

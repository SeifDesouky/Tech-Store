import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, tap } from 'rxjs';
import { CacheService } from '../../services/cache/cache.service';

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
    const cacheService = inject(CacheService);

    // Only cache GET requests
    if (req.method !== 'GET') {
        return next(req);
    }

    // Check if request should be cached (you can add custom headers to control this)
    const skipCache = req.headers.has('X-Skip-Cache');
    if (skipCache) {
        return next(req);
    }

    // Check cache
    const cachedResponse = cacheService.get(req.url);
    if (cachedResponse) {
        return of(cachedResponse);
    }

    // If not cached, make request and cache the response
    return next(req).pipe(
        tap(event => {
            if (event instanceof HttpResponse) {
                cacheService.set(req.url, event);
            }
        })
    );
};

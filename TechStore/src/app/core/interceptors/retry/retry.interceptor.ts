import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { retry, timer } from 'rxjs';

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
    // Only retry GET requests
    if (req.method !== 'GET') {
        return next(req);
    }

    // Retry configuration
    const maxRetries = 3;
    const delayMs = 1000; // 1 second

    return next(req).pipe(
        retry({
            count: maxRetries,
            delay: (error: HttpErrorResponse, retryCount: number) => {
                // Don't retry on client errors (4xx) except 408 (timeout) and 429 (too many requests)
                if (error.status >= 400 && error.status < 500 && error.status !== 408 && error.status !== 429) {
                    throw error;
                }

                // Don't retry on authentication errors
                if (error.status === 401 || error.status === 403) {
                    throw error;
                }

                console.log(`Retrying request (${retryCount}/${maxRetries})...`);

                // Exponential backoff: delay increases with each retry
                return timer(delayMs * retryCount);
            }
        })
    );
};

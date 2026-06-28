import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class CacheService {
    private cache = new Map<string, { response: HttpResponse<any>; timestamp: number }>();
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    get(url: string): HttpResponse<any> | null {
        const cached = this.cache.get(url);

        if (!cached) {
            return null;
        }

        // Check if cache is still valid
        const now = Date.now();
        if (now - cached.timestamp > this.CACHE_DURATION) {
            this.cache.delete(url);
            return null;
        }

        return cached.response;
    }

    set(url: string, response: HttpResponse<any>): void {
        this.cache.set(url, {
            response,
            timestamp: Date.now()
        });
    }

    clear(): void {
        this.cache.clear();
    }

    clearUrl(url: string): void {
        this.cache.delete(url);
    }
}

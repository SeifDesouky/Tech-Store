import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Router, RouterOutlet } from '@angular/router';
import { GuestCartService } from '../guest-cart.service';
import { CartService } from '../cart.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private API_URL = `${environment.apiUrl}/users`;

  private currentUserSubject = new BehaviorSubject<any>(
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router,
    private guestCartService: GuestCartService,
    private cartService: CartService) { }

  /* ===================== AUTH ===================== */

  register(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, data);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, credentials).pipe(
      tap((res: any) => {
        this.setSession(res.token, res.user);
        this.mergeGuestCartIfExists();
      })
    );
  }
  private mergeGuestCartIfExists(): void {
  const guestItems = this.guestCartService.getGuestCart();

  if (!guestItems.length) return;

  this.cartService.mergeGuestCart(guestItems).subscribe({
    next: () => {
      this.guestCartService.clearGuestCart();
      console.log('✅ Guest cart merged');
    },
    error: (err) => {
      console.error('❌ Merge failed', err);
    }
  });
}


  socialLogin(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/social-login`, data).pipe(
      tap((res: any) => {
        this.setSession(res.token, res.user);
      })
    );
  }

  verify2FA(data: { userId: string; code: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/verify-2fa`, data);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.put(`${this.API_URL}/reset-password/${token}`, { password });
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.get(`${this.API_URL}/verify/${token}`);
  }

  /* ===================== SESSION ===================== */

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigateByUrl('/');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  getUserRole(): string | null {
    return this.getCurrentUser()?.role || null;
  }

  /* ===================== PRIVATE ===================== */

  private setSession(token: string, user: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}

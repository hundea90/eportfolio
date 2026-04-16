import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripDataService } from './trip-data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  // Setup  storage and service access
  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripDataService
  ) {}
  // Variable to handle Authentication Responses
  authResp: AuthResponse = new AuthResponse();

  // Get our token from  Storage provider.
  
  public getToken(): string {
    let out: any;
    out = this.storage.getItem('travlr-token');
    //  return a string 
    if (!out) {
      return '';
    }
    return out;
  }
  // Save token to  Storage provider.
  
  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }
  // Logout of  application and remove the JWT from Storage
  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  // Boolean to determine if logged in and the token is
  // still valid. Even if a token  will still have to
  // reauthenticate if the token has expired
  public isLoggedIn(): boolean {
    const token: string = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }
  // Retrieve the current user. 
  public getCurrentUser(): User {
    const token: string = this.getToken();
    const { email, name } = JSON.parse(atob(token.split('.')[1]));
    return { email, name } as User;
  }

    /** 
   *  ENHANCEMENT code: 
   * This handles the logic from flowchart 
   */
  public validateForm(email: string, start: Date, end: Date): boolean {
    // 1. Data Normalization
    const cleanEmail = email.trim().toLowerCase();

    // 2. Email Validation decision 1
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if (!emailRegex.test(cleanEmail)) {
      console.error("Invalid Email Format");
      return false; 
    }

    // 3. Date Range Decision 2
    if (end < start) {
      console.error("Date Error: End date before Start date");
      return false;
    }

    // 4. If all pass, return true 
    return true;
  }
  public login(user: User, passwd: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // 1. Send async http post request
      this.tripDataService.login(user, passwd).subscribe({
        next: (value: any) => {
          // 2. Server response (Yes path) -> Update app state
          if (value && value.token) {
            this.saveToken(value.token);
            resolve(value); 
          } else {
            reject("No token received");
          }
        },
        error: (err: any) => {
          // 3. Server response (No path) -> Catch error
          reject(err); 
        }
      });
    });
   
}
  
  // login method because the behavior of the API logs a new user in
  // immediately upon registration
  public register(user: User, passwd: string): void {
    this.tripDataService.register(user, passwd).subscribe({
      next: (value: any) => {
        if (value) {
          console.log(value);
          this.authResp = value;
          this.saveToken(this.authResp.token);
        }
      },
      error: (error: any) => {
        console.log('Error: ' + error);
      },
    });
  }
}

import {Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';
import { User } from '../models/user';

import { AuthResponse } from '../models/auth-response';
import { BROWSER_STORAGE } from '../storage';


@Injectable({
  providedIn: 'root',
})
export class TripDataService {
  private baseUrl = 'http://localhost:3000/api'; 
  private url = `${this.baseUrl}/trips`;
  
  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ){}
  private getAuthHeaders(): HttpHeaders {
    // 1. Retrieve the token
    const token = this.storage.getItem('travlr-token');
    
    // 2. SAFE CHECK: If token is missing, return empty headers instead of crashing
    if (!token) {
      console.warn('Auth token not found yet. Sending request without headers.');
      return new HttpHeaders(); 
    }

    // 3. If token exists, send the proper Bearer header
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  getTrips(): Observable<Trip[]> {
  
  const httpOptions = {
    headers: this.getAuthHeaders()
  };

  // This sends a clean request to http://localhost:3000/api/trips
  return this.http.get<Trip[]>(this.url, httpOptions);
}

    addTrip(formData: Trip): Observable<Trip> {
const httpOptions = { headers: this.getAuthHeaders() };
    return this.http.post<Trip>(this.url, formData, httpOptions);
    }
 getTrip(tripCode: string): Observable<Trip> {
  const httpOptions = { headers: this.getAuthHeaders() }; 
  return this.http.get<Trip>(this.url + '/' + tripCode, httpOptions);
}
  
  updateTrip(formData: Trip): Observable<Trip> {
    const httpOptions = { headers: this.getAuthHeaders() };
  return this.http.put<Trip>(this.url + '/' + formData.code, formData, httpOptions);
  }
// Add this to trip-data.service.ts
  deleteTrip(tripCode: string): Observable<any> {
    const httpOptions = { headers: this.getAuthHeaders() };
    return this.http.delete(`${this.url}/${tripCode}`, httpOptions);
  }


// Call to /login endpoint, returns JWT
login(user: User, passwd: string) : Observable<AuthResponse> {
// console.log('Inside TripDataService::login');
return this.handleAuthAPICall('login', user, passwd);
}
// Call to  /register endpoint, creates user and returns JWT
register(user: User, passwd: string) : Observable<AuthResponse> {
// console.log('Inside TripDataService::register');
return this.handleAuthAPICall('register', user, passwd);
}
// helper method to process both login and register methods
handleAuthAPICall(endpoint: string, user: User, passwd: string) :
Observable<AuthResponse> {
let formData = {
name: user.name,
email: user.email,
password: passwd
};
return this.http.post<AuthResponse>(this.baseUrl + '/' + endpoint,
formData);
}
}
  
  


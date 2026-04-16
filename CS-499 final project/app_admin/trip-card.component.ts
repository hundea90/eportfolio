import {Component, OnInit, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink } from '@angular/router'; 
import {Trip } from '../models/trip'; 
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.css'
})
export class TripCardComponent implements OnInit {
  @Input('trip') trip: any; 
constructor(
  private router:Router,
   private authenticationService: AuthenticationService
  ) { }
ngOnInit(): void {
}
public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn(); ;
}

public editTrip(trip: Trip) {
    localStorage.removeItem("tripCode");
    localStorage.setItem("tripCode", trip.code);
    this.router.navigate(['edit-trip', trip.code]);

  }
  public deleteTrip(trip: any): void {
  // Store the code so the delete-trip component knows which one to remove
  localStorage.setItem("tripCode", trip.code);
  this.router.navigate(['delete-trip']);
}

}

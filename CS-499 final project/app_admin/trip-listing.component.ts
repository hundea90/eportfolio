import { Component, OnInit, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import { TripCardComponent } from '../trip-card/trip-card.component';
import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data.service';
import { Router} from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, TripCardComponent],
  templateUrl: './trip-listing.component.html',
  styleUrl: './trip-listing.component.css',
  providers: [TripDataService]
})
export class TripListingComponent implements OnInit {

  trips: Trip[] = []; 
  allTrips: Trip[] = [];
  message: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  searchTerm: string = '';

  constructor(
    private tripDataService: TripDataService,
    public authService: AuthenticationService,
    private router: Router
  ){
    console.log('trip-listing constructor');
  }
     
  public addTrip(): void {
    this.router.navigate(['add-trip']);
  }

  public editTrip(trip: any): void {
    localStorage.removeItem("tripCode");
    localStorage.setItem("tripCode", trip.code);
    this.router.navigate(['edit-trip']);
  }

  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  public deleteTrip(trip: any): void {
    if (confirm(`Are you sure you want to delete ${trip.name}?`)) {
      this.tripDataService.deleteTrip(trip.code).subscribe({
        next: (value: any) => {
          console.log('Trip deleted successfully');
          this.trips = this.trips.filter(t => t.code !== trip.code);
          this.message = `There are ${this.trips.length} trips available.`;
        },
        error: (error: any) => {
          console.log('Error deleting trip: ' + error);
        }
      });
    }
  }

  private getStuff(): void {
    this.tripDataService.getTrips()
      .subscribe({
        next: (value: any) => {
          this.allTrips = value;
          this.trips = value;
          this.message = value.length > 0 
            ? `Showing ${value.length} trips.` 
            : 'No trips found.';
        },
        error: (error: any) => console.log('Error: ' + error)
      });
  }
  public onSearch(searchValue: string): void {
  // Use searchValue directly since the button sends the string
  const term = searchValue.toLowerCase();
  this.searchTerm = term;

  this.trips = this.allTrips.filter(trip => 
    trip.name.toLowerCase().includes(term) ||
    trip.resort.toLowerCase().includes(term)
  );

  this.message = this.trips.length > 0 
    ? `Showing ${this.trips.length} trips.` 
    : 'No trips found.';

}
public clearSearch(searchInput: HTMLInputElement): void {
  searchInput.value = ''; // Clears the physical text box
  this.searchTerm = '';
  this.trips = this.allTrips; // Resets the list to show everything
  this.message = `Showing ${this.trips.length} trips.`;
}
public nextPage(): void {
    this.currentPage++;
    this.getStuff();
  }

  public prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getStuff();
    }
  }

  
  @Input() trip: any; 

  ngOnInit(): void {
    console.log('ngOnInit');
    setTimeout(() => {
    this.getStuff();
  }, 200);
}
}

import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { TripDataService } from '../services/trip-data.service'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-trip',
  standalone: true,          
  imports: [CommonModule],
  templateUrl: './delete-trip.component.html',
  styleUrls: ['./delete-trip.component.css']
})
export class DeleteTripComponent implements OnInit {

  constructor(
    private router: Router,
    private tripService: TripDataService
  ) { }

  ngOnInit(): void {
    // 1. Retrieve the code from storage
    const tripCode = localStorage.getItem("tripCode");

    // 2. Validate existence 
    if (!tripCode) {
      alert("Something went wrong, couldn't find the trip code.");
      this.router.navigate(['list-trips']);
      return;
    }

    console.log("DeleteTripComponent found tripCode:", tripCode);

    
    // 3. Execute deletion using Subscribe
this.tripService.deleteTrip(tripCode)
  .subscribe({
    next: (data) => {
      console.log("Success:", data);
      localStorage.removeItem("tripCode"); 
      this.router.navigate(['list-trips']);
    },
    error: (err) => {
      console.error("Delete failed:", err);
      alert("Error deleting trip. Please check your permissions.");
      this.router.navigate(['list-trips']);
    }
  });
}
}

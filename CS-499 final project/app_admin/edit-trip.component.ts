import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.component.html',
  styleUrl: './edit-trip.component.css'
})
export class EditTripComponent implements OnInit {
  // All variables must be INSIDE the class
  public editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripDataService
  ) {}

  ngOnInit(): void {
    let tripCode = localStorage.getItem("tripCode");
    if (!tripCode) {
      alert("Something wrong, couldn't find where I stashed tripCode!");
      this.router.navigate(['']);
      return;
    }

    this.editForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.tripDataService.getTrip(tripCode)
      .subscribe({
        next: (value: any) => {
          this.trip = value;
          // Step 1: Get the record (handling array vs object)
          let tripData = Array.isArray(value) ? value[0] : value;
          
          if (tripData) {
            // Step 2: Trim the date to YYYY-MM-DD so the form accepts it
            if (tripData.start) {
              tripData.start = tripData.start.slice(0, 10);
            }
            this.editForm.patchValue(tripData);
            this.message = 'Trip: ' + tripCode + ' retrieved';
          }
        },
        error: (error: any) => console.log('Error: ' + error)
      });
  }

  // Wrapped your save logic in a proper function
  public onSubmit() {
    this.submitted = true;

    //  Debug log to see exactly what is blocking the save in the Console 
    if (this.editForm.invalid) {
      console.log('Form is invalid');
      Object.keys(this.editForm.controls).forEach(key => {
        const controlErrors = this.editForm.get(key)?.errors;
        if (controlErrors) {
          console.log('Key:', key, 'Errors:', controlErrors);
        }
      });
      return; // Stop here if invalid
    }

    this.tripDataService.updateTrip(this.editForm.getRawValue())
      .subscribe({
        next: (value: any) => {
          console.log('Update successful:', value);
          this.router.navigate(['']);
        },
        error: (error: any) => console.log('Error: ' + error)
      });
  }

  
  get f() { return this.editForm.controls; }
}

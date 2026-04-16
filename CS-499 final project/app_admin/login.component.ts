import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

public formError: string = '';
  submitted = false;

  credentials = {
  name: '',
  email: '',
  password: ''
}
constructor(
  private router: Router,
  private authenticationService: AuthenticationService
) { }
ngOnInit(): void {
}
 /**
   * Validates form input before initiating the login process.
   * Demonstrates defensive programming by checking for missing credentials.
   */
public onLoginSubmit(): void {
  this.formError = '';
  if (!this.credentials.email || !this.credentials.password)
 {
  this.formError = 'All fields are required, please try again';
  this.router.navigateByUrl('#'); // Return to login page
  return; 
  }

  // 2. ENHANCEMENT: based on Flowchart Validation Normalization & Format Check
  
  const isValid = this.authenticationService.validateForm(
    this.credentials.email, 
    new Date(), 
    new Date()
  );

  if (!isValid) {
    this.formError = 'Please enter a valid email address.';
    return; // Exit if validation fails
  }

  // 3. If all checks pass, proceed to async login
  this.doLogin();
}

// ENHANCEMENT 1 Asynchronous Login Execution: Implementing the Flowchart Logic
  private async doLogin(): Promise<void> {
    try {
      // 1. Send async http post request 
      const user = { 
        email: this.credentials.email, 
        name: this.credentials.name 
      } as User;

      await this.authenticationService.login(user, this.credentials.password);

      // 2. Server response (Yes path) -> "Change path to admin"
      console.log('Login successful, redirecting...');
      this.router.navigateByUrl('list-trips'); 

    } catch (err) {
      // 3. Server response (No path) -> "Display error message"
      this.formError = 'Invalid email or password. Please try again.';
      console.error('Login error:', err);
    }
  }
}



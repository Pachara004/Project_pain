import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Pain } from '../../services/api/pain';
import { SignupData, Users } from '../../model/signup-login';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [HttpClientModule,CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  constructor(private pain: Pain, private router: Router, private http: HttpClient) {}

  userlogin: Users[] = [];
  signup1: SignupData[] = [];
  selectedImage: any;

  async loginuser(username: string, password: string, event: Event) {
    event.preventDefault();
    this.userlogin = await this.pain.LoginUser(username, password);
    if (this.userlogin.length > 0) {
      this.router.navigate(['/login']);
    } else {
      console.log("Login failed");
    }
  }

  async signup(username: string, password: string, confirmPassword: string, event: Event) {
    event.preventDefault();
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }
    if (!this.selectedImage) {
      console.log("Please select an image");
      return;
    }
    const type = 'user';
    try {
      this.signup1 = await this.pain.SignupUser(username, password, type, this.selectedImage);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Signup failed:', error);
    }
  }

  handleImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  getObjectURL(file: File): string {
    return window.URL.createObjectURL(file);
  }
}

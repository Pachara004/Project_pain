import { Component, OnInit } from '@angular/core';
import { Getimgservice } from '../services/api/Getimgservice';
import { Pain } from '../services/api/pain';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { Users } from '../model/signup-login';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { lastValueFrom } from 'rxjs';
import { Constants } from '../config/constants';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,MatButtonModule,MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  profileImageUrl: string = '';

  constructor(
    private router: Router,
    private pain: Pain,
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      const users = JSON.parse(localStorage.getItem('user')!);
      const userID = users[0].userID.toString();

      this.pain.isLoggedInUser(userID).then((isLoggedIn: { image: string } | null) => {
        // console.log('isLoggedIn:', isLoggedIn);
        if (isLoggedIn && isLoggedIn.image) {
          // console.log('User is logged in');
          this.profileImageUrl = isLoggedIn.image;
          this.isLoggedIn$.next(true); // Set the BehaviorSubject to true
        } else {
          // console.log('User is not logged in');
          this.profileImageUrl = 'https://lens-storage.storage.googleapis.com/png/df7fe5a9628f4a8bb088c8e59a942b22';
          this.isLoggedIn$.next(false); // Set the BehaviorSubject to false
        }
      });
    }
  }

  Logout() {
    localStorage.removeItem('user');
    this.isLoggedIn$.next(false); // Set the BehaviorSubject to false
    this.router.navigate(['']);
  }

  Main() {
    this.router.navigate(['']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToRankings() {
    this.router.navigate(['/ranking']);
  }

  goToGraph() {
    this.router.navigate(['/graph']);
  }

  login() {
    this.router.navigate(['/login']);
  }

  search() {
    this.router.navigate(['/search']);
  }
}
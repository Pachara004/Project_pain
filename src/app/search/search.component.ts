import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";

@Component({
    selector: 'app-search',
    standalone: true,
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
    imports: [MatButtonModule, HeaderComponent, CommonModule]
})
export class SearchComponent {
  isLoggedIn: boolean = false;
  profileImageUrl: any;
  constructor(private router:Router){}
  logout() {
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
  Main() {
    this.router.navigate([''])
    }
    goToProfile() {
        this.router.navigate(['/profile']);
      }
    goToRankings() {
        this.router.navigate(['/ranking']);
      }
    login() {
        this.router.navigate(['login']);
    }
    search() {
        this.router.navigate(['search']);
        }
}

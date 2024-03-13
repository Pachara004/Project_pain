import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";

@Component({
    selector: 'app-profile',
    standalone: true,
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    imports: [MatButtonModule, HeaderComponent]
})
export class ProfileComponent {
  constructor(private router:Router){}
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

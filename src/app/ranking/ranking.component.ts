import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Getimgservice } from '../services/api/Getimgservice';
import { GetRankToDay } from '../model/img';
import { HeaderComponent } from "../header/header.component";
import { Pain } from '../services/api/pain';
import { BehaviorSubject } from 'rxjs';


@Component({
    selector: 'app-ranking',
    standalone: true,
    templateUrl: './ranking.component.html',
    styleUrls: ['./ranking.component.scss'],
    imports: [
        MatButtonModule,
        MatCommonModule,
        CommonModule,
        MatIconModule,
        HeaderComponent
    ]
})
export class RankingComponent implements OnInit {
  isLoggedIn: boolean = false;
  profileImageUrl: any;
  playerRankings: any[] = [];
  ToDayRank: GetRankToDay[] = [];
  YesterDayRank: GetRankToDay[] = [];
  rank: GetRankToDay[] = [];

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private pain: Pain,
    private getimgservice: Getimgservice
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      const users = JSON.parse(localStorage.getItem('user')!);
      const userID = users[0].userID.toString();
      this.isLoggedIn = true;
    }
    this.loadPlayerRankings();
  }

  async loadPlayerRankings() {
    try {
      this.ToDayRank = await this.getimgservice.GetRankToDay();
      this.YesterDayRank = await this.getimgservice.GetRankYesterDay();
      this.updateRank(this.ToDayRank, this.YesterDayRank);
    } catch (error) {
      console.error('Error loading player rankings:', error);
    }
  }

  updateRank(ToDayRank: GetRankToDay[], YesterDayRank: GetRankToDay[]): void {
    const minLength = Math.min(ToDayRank.length, YesterDayRank.length);
    for (let i = 0; i < minLength; i++) {
      const RankNow: GetRankToDay = { ...ToDayRank[i] };
      RankNow.RankDifferent = YesterDayRank[i].RankingYesterDay - ToDayRank[i].RankingToDay;
      RankNow.name = ToDayRank[i].name;
      RankNow.RankingYesterDay = YesterDayRank[i].RankingYesterDay;
      this.rank.push(RankNow);
    }
  }

  Main() {
    this.router.navigate(['/'])
  }

  logout() {
    this.cookieService.delete('isLoggedIn');
    this.cookieService.delete('userID');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  login() {
    this.router.navigate(['/login']);
  }

  signup() {
    this.router.navigate(['/login/signup'])
  }
}

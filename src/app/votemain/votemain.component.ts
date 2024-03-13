import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { Pain } from '../services/api/pain';
import { Users } from '../model/signup-login';
import { GetImg } from '../model/img';
import { Getimgservice } from '../services/api/Getimgservice';
import { CookieService } from 'ngx-cookie-service';
import { HeaderComponent } from "../header/header.component";


@Component({
    selector: 'app-votemain',
    standalone: true,
    templateUrl: './votemain.component.html',
    styleUrl: './votemain.component.scss',
    imports: [MatButtonModule, HttpClientModule, CommonModule, HeaderComponent]
})
export class VotemainComponent implements OnInit {
  isLoggedIn: boolean = false;
  profileImageUrl: any;
  username: any;
  password: any;
  data: any;
  userID : any;
  allimg : GetImg[] = [];
  selectedImages: GetImg[] = [];
  votedImages: GetImg[] = [];
  imgwinner : GetImg[] = [];
  imgloser : GetImg[] = [];
  votedImagesIds: Set<number> = new Set<number>();
  totalImages: number = 0;
  votedImagesCount: number = 0;
  countdownSeconds: number = 0;
  show : boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private getimg: Getimgservice,

  )
   {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { data: string };
    this.data = state?.data;
  }

  ngOnInit(): void {
    this.loadImg();
    this.route.queryParams.subscribe(params => {
    });
  }
  shuffleImages(images: GetImg[]) {
    let currentIndex = images.length;
    let randomIndex: number;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [images[currentIndex], images[randomIndex]] = [images[randomIndex], images[currentIndex]];
    }

    return images;
  }
  loadNextImages() {
    const remainingImages = this.allimg.filter(img => !this.votedImagesIds.has(img.imageID));

    if (remainingImages.length >= 2) {
      this.selectedImages = this.shuffleImages(remainingImages.slice(0, 2));
    } else {
      this.loadImg();
    }
  }
  async loadImg(){
    this.allimg = this.shuffleImages(await this.getimg.Getimg());
    this.totalImages = this.allimg.length;
    this.loadNextImages();
    this.show = true;
  }
  onImageClick(winnerIndex: number) {
    const winnerImage = this.selectedImages[winnerIndex];
    const loserIndex = winnerIndex === 0 ? 1 : 0;
    const loserImage = this.selectedImages[loserIndex];

    if (this.votedImagesIds.has(winnerImage.imageID) || this.votedImagesIds.has(loserImage.imageID)) {
      alert('ไม่สามารถโหวตรูปเดิมได้');
      return;
    }
    this.imgwinner.pop();
    this.imgloser.pop();
    winnerImage.isWinner = true;
    loserImage.isLoser = false;

    const expectedWinnerProbability = this.getExpectedScore(winnerImage.score, loserImage.score);
    const expectedLoserProbability = this.getExpectedScore(loserImage.score, winnerImage.score);
    this.updateElo(winnerImage, loserImage, expectedWinnerProbability,expectedLoserProbability);

    this.votedImagesIds.add(winnerImage.imageID);
    this.votedImagesIds.add(loserImage.imageID);
    this.votedImagesCount += 2;

    if (this.votedImagesCount === this.totalImages) {
      console.log('โหวตครบทุกรูปแล้ว');
      this.show = false;
      this.countdownSeconds = 2;
      const intervalId = setInterval(() => {
        this.countdownSeconds--;

        if (this.countdownSeconds < 0) {
          clearInterval(intervalId);
          console.log('นับถอยหลังเสร็จสิ้น');
          this.votedImagesCount = 0;
          this.votedImagesIds.clear();
          this.loadImg();
        }
      }, 2000);
      return;
    } else {
      this.loadNextImages();
    }

  }
  calculateKFactor(rating: number) {
    if (rating >= 0 && rating <= 600) {
      return 25;
    } else if (rating >= 601 && rating <= 2400) {
      return 15;
    } else if (rating >= 2401 && rating <= 3000) {
      return 10;
    } else if (rating > 3000) {
      return 5;
    } else {
      return 32;
    }
  }

  getExpectedScore(ratingA: number, ratingB: number) {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  }

  async updateElo(winner: GetImg, loser: GetImg, expectedwinProbability: number,expectedLoserProbability : number) {
    const actualWinnerProbability = 1; // ผลการโหวตจริง (คือชนะ)
    const actualLoserProbability = 0; // ผลการโหวตจริง (คือชนะ)
    const kFactorWinner = this.calculateKFactor(winner.score); // นำเข้าค่า K Factor ตามคะแนนปัจจุบันของ winner
    const kFactorLoser = this.calculateKFactor(loser.score); // นำเข้าค่า K Factor ตามคะแนนปัจจุบันของ loser

    // คำนวณคะแนนใหม่สำหรับ winner และ loser
    const winnerNewRating = Math.round(kFactorWinner * (actualWinnerProbability - expectedwinProbability));
    const loserNewRating = Math.round(kFactorLoser * (actualLoserProbability - expectedLoserProbability));
    console.log("winnerNewRating : "+winnerNewRating);
    console.log("loserNewRating : "+loserNewRating);

    this.imgwinner.push(winner);
    this.imgloser.push(loser);
    console.log(this.imgwinner);
    console.log(this.imgloser);
    console.log(winner);

    const checkwinner = await this.getimg.InsertVote(winner.uid,winner.imageID,winnerNewRating,winner.isWinner);
    const checkloser  = await this.getimg.InsertVote(loser.uid,loser.imageID,loserNewRating,loser.isLoser);

    winner.score = winnerNewRating + winner.score;
    loser.score = loserNewRating + loser.score;
    if(checkwinner === true && checkloser === true){
      await this.getimg.Updateimg(winner.imageID,winner.score);
      await this.getimg.Updateimg(loser.imageID,loser.score);
    }
  }
}

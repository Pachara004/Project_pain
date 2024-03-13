import { Injectable } from '@angular/core';
import { Constants } from '../../config/constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { GetImg, GetRankToDay, VoteImg } from '../../model/img';
@Injectable({
  providedIn: 'root'
})
export class Getimgservice {


      constructor(private constants : Constants , private http : HttpClient){}
      public async Getimg() {
        const url = this.constants.API_ENDPOINT + "/image";
        const response = await lastValueFrom(this.http.get(url));
        return response as GetImg[];
      }

      public async InsertVote(userID: number, imageID: number, score: number, isWinner: boolean ) {
        const url = this.constants.API_ENDPOINT + '/vote/insertimg';
        const body = {
            userID: userID,
            imageID: imageID,
            score: score,
            isWinner: isWinner,
        };
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        try {
          const response = await this.http.post(url, body, { headers: headers }).toPromise();
          return true;
        } catch (error) {
          throw error;
        }
      }
      public async Updateimg(imageID: number, score: number) {
        const url = this.constants.API_ENDPOINT + '/image/update/'+imageID;
        const body = {
          score: score,
        };
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        try {
          const response = await this.http.put(url, body, { headers: headers }).toPromise();
          return true;
        } catch (error) {
          throw error;
        }
      }
      public async GetRankToDay() {
        const urlToday = this.constants.API_ENDPOINT + "/rank/today";
        const response = await lastValueFrom(this.http.get(urlToday));
        return response as GetRankToDay[];
      }
      public async GetRankYesterDay() {
        const urlYesterday = this.constants.API_ENDPOINT + "/rank/yesterday";
        const response = await lastValueFrom(this.http.get(urlYesterday));
        return response as GetRankToDay[];
      }
      public async GetGraph(uid: number) {
        const url = this.constants.API_ENDPOINT + "/rank/graph/" + uid;
        const response = await lastValueFrom(this.http.get(url));
        return response as VoteImg[];
      }
}

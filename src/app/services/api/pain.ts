import { Injectable } from '@angular/core';
import { Constants } from '../../config/constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { SignupData, Users } from '../../model/signup-login';

@Injectable({
  providedIn: 'root'
})
export class Pain {
  isLoggedIn: boolean | undefined;
  queryParams: any;
  constructor(private constants: Constants, private http: HttpClient) {
    this.isLoggedIn = undefined;
  }

  public async LoginUser(username: string, password: string) {
    const url = this.constants.API_ENDPOINT + "/login/" + username + "/" + password;
    try {
      const response = await lastValueFrom(this.http.get(url));
      return response as Users[];
    } catch (error) {
      console.error('Error logging in:', error);
      return [];
    }
  }

  public async SignupUser(username: string, password: string, type: string, image: string) {
    const url = this.constants.API_ENDPOINT + '/login/signup';
    const body = {
      username: username,
      password: password,
      type: type,
      image: image
    };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    try {
      const response = await this.http.post(url, body, { headers: headers }).toPromise();
      console.log(response);
      return response as SignupData[];
    } catch (error) {
      throw error;
    }
  }

  async isLoggedInUser(userID: string): Promise<{ image: string } | null> {
    const url = this.constants.API_ENDPOINT + "/login/" + userID;
    try {
      const response = await lastValueFrom(this.http.get(url));
      console.log('Response from isLoggedInUser:', response); // เพิ่มบรรทัดนี้
      return response as { image: string };
    } catch (error) {
      console.error('Error checking login status:', error);
      return null;
    }
  }

  public logoutUser() {
    this.isLoggedIn = false;
  }

}

import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Pain } from '../services/api/pain';
import { SignupData, Users } from '../model/signup-login';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private pain: Pain, private router: Router, private http: HttpClient) {}

  userlogin : Users[] = [];
  async loginuser(username: string, password: string,event: Event) {

    event.preventDefault();
    if (username.trim() === '' || password.trim() === '') {
      alert("Username or password is not provided.");
      return;
    }else{
      this.userlogin = await this.pain.LoginUser(username, password);
    if(this.userlogin.length > 0 ){
      console.log(this.userlogin);

      const navigationExtras: NavigationExtras = {state: {data: this.userlogin[0].userID}};
        localStorage.setItem('user', JSON.stringify(this.userlogin));
        this.router.navigate([''] , navigationExtras);
    }else{
      alert("Loging failed.");
      }
    }
  }
signup() {
  this.router.navigate(['/login/signup']);
}
votemain(){
  this.router.navigate(['']);
}
}

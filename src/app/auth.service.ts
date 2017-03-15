import { Injectable } from '@angular/core';
import {LoginProfile} from './login-profile';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

@Injectable()
export class AuthService {
  isLoggedIn: boolean = false;
  loginProfile:LoginProfile = null; 
 
  // Simulate login from the back end
  login(user): Observable<boolean> {

    this.loginProfile = new LoginProfile();

   // If the user is a google user profile, normalize it
   if(user && user.getAuthResponse) {
      let profile = user.getBasicProfile();
      this.loginProfile.id = user.getId();
      this.loginProfile.token = user.getAuthResponse().id_token;
      this.loginProfile.name = profile.getName();
      this.loginProfile.imageUrl = profile.getImageUrl();
      this.loginProfile.email = profile.getEmail(); 
    // Else the email is our simulated login
    } else {
      this.loginProfile.email = user.email;
      this.loginProfile.imageUrl = "https://goo.gl/0C0RNl";
      this.loginProfile.name = "Test User";
      this.loginProfile.id = "TestUserId";
      this.loginProfile.token = "ABC123";
    }

    // NOTE: Since this is a simulated login, we are only interested in the timings for the UI
    // For a real login, follow best practices e.g.: https://developers.google.com/+/best-practices
    return Observable.of(true).delay(1000).do(val => this.isLoggedIn = true);
  }

  logout(): void {
    this.isLoggedIn = false;
    this.loginProfile = null;
  }

}

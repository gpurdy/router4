import { Component, AfterViewInit, Input}   from '@angular/core';
import { Router }      from '@angular/router';
import { AuthService } from '../auth.service';
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements AfterViewInit {
  @Input() email:string;
  @Input() password:string; // Not used for this demo

  constructor(public authService: AuthService, public router: Router) {
  }

   // Code based on excellent stackoverflow example: http://stackoverflow.com/questions/38846232/how-to-implement-signin-with-google-in-angularjs-2-using-typescript/39770500
  public auth2: any;
 
  // After the view loads, load the google API and attach a click handler to the button. 
  // The google button will then call the login method which calls the auth service to 'log' the user in
  ngAfterViewInit() {
    let that = this;
    gapi.load('auth2', function () {
      that.auth2 = gapi.auth2.init({
        client_id: '527171084167-4e6jeop4brco8ko13693cqkrheaeso92.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      that.auth2.attachClickHandler(document.getElementById('googleBtn'), {},
        that.login.bind(that), 
        function (error) {
          alert(JSON.stringify(error, undefined, 2));
        }
      );
    });
  }

  // Call the auth service login and then navigate to the dashboard
  login(user) {
    if(!user) {
      user = {email: this.email};
    }
    
    this.authService.login(user).subscribe(() => {
      if (this.authService.isLoggedIn) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}

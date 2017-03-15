import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from './auth.service';
import {Router} from '@angular/router';
declare var jQuery:any; // Materialize uses jQuery

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

// Note: Based on the example provided by the Angular 'Crisis app' 
export class AppComponent implements AfterViewInit {
   @ViewChild('buttonCollapse') buttonCollapse: ElementRef;

   constructor(public authService: AuthService, public router: Router) {
  }

  logout() {
    this.authService.logout();
      if (!this.authService.isLoggedIn) {
        this.router.navigate(['/home']);
      }
  }
  
  ngAfterViewInit() {
       // Materialize library displays the sidenav 
       jQuery(this.buttonCollapse.nativeElement).sideNav({
        closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: true // Choose whether you can drag to open on touch screens
      });
   }
}

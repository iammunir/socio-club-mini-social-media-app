import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  
  private authStatusSubs: Subscription;
  isUserAuthenticated: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.getAuthStatus();
    this.authStatusSubs = this.authService.getAuthStatusListener()
      .subscribe(response => {
        this.isUserAuthenticated = response
      })
  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logoutUser();
  }

}

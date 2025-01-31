import { Injectable } from '@angular/core';
import {

  CanActivate,
  Router,

  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { routes } from '../routes/routes';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, public auth: AuthService) {}
  canActivate(

  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      // if (localStorage.getItem('authenticated')) {
      //   return true;
      // } else {
      //   this.router.navigate([routes.login]);
      //   return false;
      // }
      if (!this.auth.token || !this.auth.user) {
        this.router.navigate([routes.login]);
        return false;
      }
      let token = this.auth.token;
      let expiracionToken = (JSON.parse(atob(token.split(".")[1]))).exp;
      if (Math.floor((new Date().getTime())/1000) >= expiracionToken){
        this.auth.logout();
        return false;
      }
      return true;
  }
}

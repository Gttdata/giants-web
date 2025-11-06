import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private cookie: CookieService) { }

  roleID = this.cookie.get("ROLE_ID")
  canActivate(route: ActivatedRouteSnapshot) {
    console.log(this.roleID)
    if (route.data['roleId'] == this.roleID || route.data['roleId1'] == this.roleID || route.data['roleId2'] == this.roleID)
      return true
    else
      return false
  }

}

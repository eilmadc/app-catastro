import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class MyCanActivate implements CanActivate {
  constructor(private authenticationService: AuthenticationService,
    private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.checkSession();
  }

  private checkSession(): boolean {
    if (this.authenticationService.isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/login']);
      this.authenticationService.toast("Por favor, inicia sesión","warning");
      return false;
    };
  }
}
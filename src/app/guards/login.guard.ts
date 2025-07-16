import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { UserAuthComponentService } from '../services/component/user/user-auth-component.service';

export const loginGuard: CanActivateFn = (route : ActivatedRouteSnapshot, state:RouterStateSnapshot) => {
  const router = inject(Router)
  const userAuthComponentService=inject(UserAuthComponentService)
  if (userAuthComponentService.isAuthenticated()) {
    return true
  }
  router.navigate(['/user-login']);
  return false;
};

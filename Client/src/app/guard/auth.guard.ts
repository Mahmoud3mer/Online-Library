import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)

  if(typeof window !== 'undefined' && window.sessionStorage){
    
    if(localStorage.getItem('token')){
      return true;
    }
    else{
      router.navigate(['/signin'])
      return false;
    }

  }
  else{
    router.navigate(['/signin'])
    return false;
  }

};

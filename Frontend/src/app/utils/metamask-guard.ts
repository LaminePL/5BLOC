import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { from, Observable } from 'rxjs';
import { ContractService } from '../services/contract/contract.service';

@Injectable()
export class MetamaskGuard implements CanActivate {
  constructor(private contactService: ContractService) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return from(this.checkMetamask());
  }


  private async checkMetamask() {
    await this.contactService.connectAccount();
    return true;
  }
}

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { DeliveryJobComponent } from './delivery-job.component';
import { DeliveryJobDetailComponent } from './delivery-job-detail.component';
import { DeliveryJobPopupComponent } from './delivery-job-dialog.component';
import { DeliveryJobDeletePopupComponent } from './delivery-job-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class DeliveryJobResolvePagingParams implements Resolve<any> {

  constructor(private paginationUtil: PaginationUtil) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      let page = route.queryParams['page'] ? route.queryParams['page'] : '1';
      let sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
      return {
          page: this.paginationUtil.parsePage(page),
          predicate: this.paginationUtil.parsePredicate(sort),
          ascending: this.paginationUtil.parseAscending(sort)
    };
  }
}

export const deliveryJobRoute: Routes = [
  {
    path: 'delivery-job',
    component: DeliveryJobComponent,
    resolve: {
      'pagingParams': DeliveryJobResolvePagingParams
    },
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'DeliveryJobs'
    },
    canActivate: [UserRouteAccessService]
  }, {
    path: 'delivery-job/:id',
    component: DeliveryJobDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'DeliveryJobs'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const deliveryJobPopupRoute: Routes = [
  {
    path: 'delivery-job-new',
    component: DeliveryJobPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'DeliveryJobs'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'delivery-job/:id/edit',
    component: DeliveryJobPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'DeliveryJobs'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'delivery-job/:id/delete',
    component: DeliveryJobDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'DeliveryJobs'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];

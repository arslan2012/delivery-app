import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DeliverySharedModule } from '../../shared';

import {
    DeliveryJobService,
    DeliveryJobPopupService,
    DeliveryJobComponent,
    DeliveryJobDetailComponent,
    DeliveryJobDialogComponent,
    DeliveryJobPopupComponent,
    DeliveryJobDeletePopupComponent,
    DeliveryJobDeleteDialogComponent,
    deliveryJobRoute,
    deliveryJobPopupRoute,
    DeliveryJobResolvePagingParams,
} from './';

let ENTITY_STATES = [
    ...deliveryJobRoute,
    ...deliveryJobPopupRoute,
];

@NgModule({
    imports: [
        DeliverySharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        DeliveryJobComponent,
        DeliveryJobDetailComponent,
        DeliveryJobDialogComponent,
        DeliveryJobDeleteDialogComponent,
        DeliveryJobPopupComponent,
        DeliveryJobDeletePopupComponent,
    ],
    entryComponents: [
        DeliveryJobComponent,
        DeliveryJobDialogComponent,
        DeliveryJobPopupComponent,
        DeliveryJobDeleteDialogComponent,
        DeliveryJobDeletePopupComponent,
    ],
    providers: [
        DeliveryJobService,
        DeliveryJobPopupService,
        DeliveryJobResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DeliveryDeliveryJobModule {}

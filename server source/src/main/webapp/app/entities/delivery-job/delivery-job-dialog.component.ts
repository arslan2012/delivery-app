import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService } from 'ng-jhipster';

import { DeliveryJob } from './delivery-job.model';
import { DeliveryJobPopupService } from './delivery-job-popup.service';
import { DeliveryJobService } from './delivery-job.service';

@Component({
    selector: 'jhi-delivery-job-dialog',
    templateUrl: './delivery-job-dialog.component.html'
})
export class DeliveryJobDialogComponent implements OnInit {

    deliveryJob: DeliveryJob;
    authorities: any[];
    isSaving: boolean;
    constructor(
        public activeModal: NgbActiveModal,
        private alertService: AlertService,
        private deliveryJobService: DeliveryJobService,
        private eventManager: EventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.deliveryJob.id !== undefined) {
            this.deliveryJobService.update(this.deliveryJob)
                .subscribe((res: DeliveryJob) =>
                    this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
        } else {
            this.deliveryJobService.create(this.deliveryJob)
                .subscribe((res: DeliveryJob) =>
                    this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
        }
    }

    private onSaveSuccess (result: DeliveryJob) {
        this.eventManager.broadcast({ name: 'deliveryJobListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError (error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError (error) {
        this.alertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-delivery-job-popup',
    template: ''
})
export class DeliveryJobPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private deliveryJobPopupService: DeliveryJobPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.deliveryJobPopupService
                    .open(DeliveryJobDialogComponent, params['id']);
            } else {
                this.modalRef = this.deliveryJobPopupService
                    .open(DeliveryJobDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager } from 'ng-jhipster';

import { DeliveryJob } from './delivery-job.model';
import { DeliveryJobPopupService } from './delivery-job-popup.service';
import { DeliveryJobService } from './delivery-job.service';

@Component({
    selector: 'jhi-delivery-job-delete-dialog',
    templateUrl: './delivery-job-delete-dialog.component.html'
})
export class DeliveryJobDeleteDialogComponent {

    deliveryJob: DeliveryJob;

    constructor(
        private deliveryJobService: DeliveryJobService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.deliveryJobService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'deliveryJobListModification',
                content: 'Deleted an deliveryJob'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-delivery-job-delete-popup',
    template: ''
})
export class DeliveryJobDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private deliveryJobPopupService: DeliveryJobPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.deliveryJobPopupService
                .open(DeliveryJobDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}

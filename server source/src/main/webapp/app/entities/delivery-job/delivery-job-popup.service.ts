import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DeliveryJob } from './delivery-job.model';
import { DeliveryJobService } from './delivery-job.service';
@Injectable()
export class DeliveryJobPopupService {
    private isOpen = false;
    constructor (
        private modalService: NgbModal,
        private router: Router,
        private deliveryJobService: DeliveryJobService

    ) {}

    open (component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.deliveryJobService.find(id).subscribe(deliveryJob => {
                this.deliveryJobModalRef(component, deliveryJob);
            });
        } else {
            return this.deliveryJobModalRef(component, new DeliveryJob());
        }
    }

    deliveryJobModalRef(component: Component, deliveryJob: DeliveryJob): NgbModalRef {
        let modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.deliveryJob = deliveryJob;
        modalRef.result.then(result => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        });
        return modalRef;
    }
}

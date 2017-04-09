import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager   } from 'ng-jhipster';

import { DeliveryJob } from './delivery-job.model';
import { DeliveryJobService } from './delivery-job.service';

@Component({
    selector: 'jhi-delivery-job-detail',
    templateUrl: './delivery-job-detail.component.html'
})
export class DeliveryJobDetailComponent implements OnInit, OnDestroy {

    deliveryJob: DeliveryJob;
    private subscription: any;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: EventManager,
        private deliveryJobService: DeliveryJobService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
        this.registerChangeInDeliveryJobs();
    }

    load (id) {
        this.deliveryJobService.find(id).subscribe(deliveryJob => {
            this.deliveryJob = deliveryJob;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInDeliveryJobs() {
        this.eventSubscriber = this.eventManager.subscribe('deliveryJobListModification', response => this.load(this.deliveryJob.id));
    }

}

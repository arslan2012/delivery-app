import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { DateUtils, DataUtils, EventManager } from 'ng-jhipster';
import { DeliveryTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { DeliveryJobDetailComponent } from '../../../../../../main/webapp/app/entities/delivery-job/delivery-job-detail.component';
import { DeliveryJobService } from '../../../../../../main/webapp/app/entities/delivery-job/delivery-job.service';
import { DeliveryJob } from '../../../../../../main/webapp/app/entities/delivery-job/delivery-job.model';

describe('Component Tests', () => {

    describe('DeliveryJob Management Detail Component', () => {
        let comp: DeliveryJobDetailComponent;
        let fixture: ComponentFixture<DeliveryJobDetailComponent>;
        let service: DeliveryJobService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DeliveryTestModule],
                declarations: [DeliveryJobDetailComponent],
                providers: [
                    DateUtils,
                    DataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    DeliveryJobService,
                    EventManager
                ]
            }).overrideComponent(DeliveryJobDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DeliveryJobDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DeliveryJobService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new DeliveryJob(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.deliveryJob).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});

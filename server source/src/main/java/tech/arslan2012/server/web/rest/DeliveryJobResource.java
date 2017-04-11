package tech.arslan2012.server.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import tech.arslan2012.server.domain.DeliveryJob;

import tech.arslan2012.server.repository.DeliveryJobRepository;
import tech.arslan2012.server.web.rest.util.HeaderUtil;
import tech.arslan2012.server.web.rest.util.PaginationUtil;
import io.swagger.annotations.ApiParam;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing DeliveryJob.
 */
@RestController
@RequestMapping("/api")
public class DeliveryJobResource {

    private final Logger log = LoggerFactory.getLogger(DeliveryJobResource.class);

    private static final String ENTITY_NAME = "deliveryJob";

    private final DeliveryJobRepository deliveryJobRepository;
    private DeliveryJob deliveryJob;

    public DeliveryJobResource(DeliveryJobRepository deliveryJobRepository) {
        this.deliveryJobRepository = deliveryJobRepository;
    }

    /**
     * POST  /delivery-jobs : Create a new deliveryJob.
     *
     * @param deliveryJob the deliveryJob to create
     * @return the ResponseEntity with status 201 (Created) and with body the new deliveryJob, or with status 400 (Bad Request) if the deliveryJob has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/delivery-jobs")
    @Timed
    public ResponseEntity<DeliveryJob> createDeliveryJob(@RequestBody DeliveryJob deliveryJob) throws URISyntaxException {
        log.debug("REST request to save DeliveryJob : {}", deliveryJob);
        if (deliveryJob.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new deliveryJob cannot already have an ID")).body(null);
        }
        DeliveryJob result = deliveryJobRepository.save(deliveryJob);
        return ResponseEntity.created(new URI("/api/delivery-jobs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /delivery-jobs : Updates an existing deliveryJob.
     *
     * @param deliveryJob the deliveryJob to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated deliveryJob,
     * or with status 400 (Bad Request) if the deliveryJob is not valid,
     * or with status 500 (Internal Server Error) if the deliveryJob couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/delivery-jobs")
    @Timed
    public ResponseEntity<DeliveryJob> updateDeliveryJob(@RequestBody DeliveryJob deliveryJob) throws URISyntaxException {
        log.debug("REST request to update DeliveryJob : {}", deliveryJob);
        if (deliveryJob.getId() == null) {
            return createDeliveryJob(deliveryJob);
        }
        DeliveryJob result = deliveryJobRepository.save(deliveryJob);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, deliveryJob.getId().toString()))
            .body(result);
    }

    /**
     * GET  /delivery-jobs : get all the deliveryJobs.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of deliveryJobs in body
     */
    @GetMapping("/delivery-jobs")
    @Timed
    public ResponseEntity<List<DeliveryJob>> getAllDeliveryJobs(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of DeliveryJobs");
        Page<DeliveryJob> page = deliveryJobRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/delivery-jobs");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping("/delivery-jobs/get-new")
    @Timed
    public ResponseEntity<DeliveryJob> getAllDeliveryJobs() {
        log.debug("REST request to get a new DeliveryJob");
        Page<DeliveryJob> page = deliveryJobRepository.findAll(new PageRequest(0, 1, Sort.Direction.ASC, "id"));
        DeliveryJob deliveryJob = page.getContent().get(0);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(deliveryJob));
    }

    /**
     * GET  /delivery-jobs/:id : get the "id" deliveryJob.
     *
     * @param id the id of the deliveryJob to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the deliveryJob, or with status 404 (Not Found)
     */
    @GetMapping("/delivery-jobs/{id}")
    @Timed
    public ResponseEntity<DeliveryJob> getDeliveryJob(@PathVariable Long id) {
        log.debug("REST request to get DeliveryJob : {}", id);
        DeliveryJob deliveryJob = deliveryJobRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(deliveryJob));
    }

    /**
     * DELETE  /delivery-jobs/:id : delete the "id" deliveryJob.
     *
     * @param id the id of the deliveryJob to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/delivery-jobs/{id}")
    @Timed
    public ResponseEntity<Void> deleteDeliveryJob(@PathVariable Long id) {
        log.debug("REST request to delete DeliveryJob : {}", id);
        deliveryJobRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

}

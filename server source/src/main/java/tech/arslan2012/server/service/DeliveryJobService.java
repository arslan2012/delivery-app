package tech.arslan2012.server.service;

import tech.arslan2012.server.domain.DeliveryJob;
import tech.arslan2012.server.repository.DeliveryJobRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service Implementation for managing DeliveryJob.
 */
@Service
@Transactional
public class DeliveryJobService {

    private final Logger log = LoggerFactory.getLogger(DeliveryJobService.class);
    
    private final DeliveryJobRepository deliveryJobRepository;

    public DeliveryJobService(DeliveryJobRepository deliveryJobRepository) {
        this.deliveryJobRepository = deliveryJobRepository;
    }

    /**
     * Save a deliveryJob.
     *
     * @param deliveryJob the entity to save
     * @return the persisted entity
     */
    public DeliveryJob save(DeliveryJob deliveryJob) {
        log.debug("Request to save DeliveryJob : {}", deliveryJob);
        DeliveryJob result = deliveryJobRepository.save(deliveryJob);
        return result;
    }

    /**
     *  Get all the deliveryJobs.
     *  
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<DeliveryJob> findAll(Pageable pageable) {
        log.debug("Request to get all DeliveryJobs");
        Page<DeliveryJob> result = deliveryJobRepository.findAll(pageable);
        return result;
    }

    /**
     *  Get one deliveryJob by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Transactional(readOnly = true)
    public DeliveryJob findOne(Long id) {
        log.debug("Request to get DeliveryJob : {}", id);
        DeliveryJob deliveryJob = deliveryJobRepository.findOne(id);
        return deliveryJob;
    }

    /**
     *  Delete the  deliveryJob by id.
     *
     *  @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete DeliveryJob : {}", id);
        deliveryJobRepository.delete(id);
    }
}

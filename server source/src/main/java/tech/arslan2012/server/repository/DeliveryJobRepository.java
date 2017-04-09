package tech.arslan2012.server.repository;

import tech.arslan2012.server.domain.DeliveryJob;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the DeliveryJob entity.
 */
@SuppressWarnings("unused")
public interface DeliveryJobRepository extends JpaRepository<DeliveryJob,Long> {

}

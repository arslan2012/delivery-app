package tech.arslan2012.server.web.rest;

import tech.arslan2012.server.DeliveryApp;

import tech.arslan2012.server.domain.DeliveryJob;
import tech.arslan2012.server.repository.DeliveryJobRepository;
import tech.arslan2012.server.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the DeliveryJobResource REST controller.
 *
 * @see DeliveryJobResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = DeliveryApp.class)
public class DeliveryJobResourceIntTest {

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final Double DEFAULT_LONGITUDE = 1D;
    private static final Double UPDATED_LONGITUDE = 2D;

    private static final Double DEFAULT_LATITUDE = 1D;
    private static final Double UPDATED_LATITUDE = 2D;

    @Autowired
    private DeliveryJobRepository deliveryJobRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restDeliveryJobMockMvc;

    private DeliveryJob deliveryJob;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        DeliveryJobResource deliveryJobResource = new DeliveryJobResource(deliveryJobRepository);
        this.restDeliveryJobMockMvc = MockMvcBuilders.standaloneSetup(deliveryJobResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DeliveryJob createEntity(EntityManager em) {
        DeliveryJob deliveryJob = new DeliveryJob()
            .address(DEFAULT_ADDRESS)
            .longitude(DEFAULT_LONGITUDE)
            .latitude(DEFAULT_LATITUDE);
        return deliveryJob;
    }

    @Before
    public void initTest() {
        deliveryJob = createEntity(em);
    }

    @Test
    @Transactional
    public void createDeliveryJob() throws Exception {
        int databaseSizeBeforeCreate = deliveryJobRepository.findAll().size();

        // Create the DeliveryJob
        restDeliveryJobMockMvc.perform(post("/api/delivery-jobs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(deliveryJob)))
            .andExpect(status().isCreated());

        // Validate the DeliveryJob in the database
        List<DeliveryJob> deliveryJobList = deliveryJobRepository.findAll();
        assertThat(deliveryJobList).hasSize(databaseSizeBeforeCreate + 1);
        DeliveryJob testDeliveryJob = deliveryJobList.get(deliveryJobList.size() - 1);
        assertThat(testDeliveryJob.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testDeliveryJob.getLongitude()).isEqualTo(DEFAULT_LONGITUDE);
        assertThat(testDeliveryJob.getLatitude()).isEqualTo(DEFAULT_LATITUDE);
    }

    @Test
    @Transactional
    public void createDeliveryJobWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = deliveryJobRepository.findAll().size();

        // Create the DeliveryJob with an existing ID
        deliveryJob.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDeliveryJobMockMvc.perform(post("/api/delivery-jobs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(deliveryJob)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<DeliveryJob> deliveryJobList = deliveryJobRepository.findAll();
        assertThat(deliveryJobList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllDeliveryJobs() throws Exception {
        // Initialize the database
        deliveryJobRepository.saveAndFlush(deliveryJob);

        // Get all the deliveryJobList
        restDeliveryJobMockMvc.perform(get("/api/delivery-jobs?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(deliveryJob.getId().intValue())))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS.toString())))
            .andExpect(jsonPath("$.[*].longitude").value(hasItem(DEFAULT_LONGITUDE.doubleValue())))
            .andExpect(jsonPath("$.[*].latitude").value(hasItem(DEFAULT_LATITUDE.doubleValue())));
    }

    @Test
    @Transactional
    public void getDeliveryJob() throws Exception {
        // Initialize the database
        deliveryJobRepository.saveAndFlush(deliveryJob);

        // Get the deliveryJob
        restDeliveryJobMockMvc.perform(get("/api/delivery-jobs/{id}", deliveryJob.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(deliveryJob.getId().intValue()))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS.toString()))
            .andExpect(jsonPath("$.longitude").value(DEFAULT_LONGITUDE.doubleValue()))
            .andExpect(jsonPath("$.latitude").value(DEFAULT_LATITUDE.doubleValue()));
    }

    @Test
    @Transactional
    public void getNonExistingDeliveryJob() throws Exception {
        // Get the deliveryJob
        restDeliveryJobMockMvc.perform(get("/api/delivery-jobs/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDeliveryJob() throws Exception {
        // Initialize the database
        deliveryJobRepository.saveAndFlush(deliveryJob);
        int databaseSizeBeforeUpdate = deliveryJobRepository.findAll().size();

        // Update the deliveryJob
        DeliveryJob updatedDeliveryJob = deliveryJobRepository.findOne(deliveryJob.getId());
        updatedDeliveryJob
            .address(UPDATED_ADDRESS)
            .longitude(UPDATED_LONGITUDE)
            .latitude(UPDATED_LATITUDE);

        restDeliveryJobMockMvc.perform(put("/api/delivery-jobs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDeliveryJob)))
            .andExpect(status().isOk());

        // Validate the DeliveryJob in the database
        List<DeliveryJob> deliveryJobList = deliveryJobRepository.findAll();
        assertThat(deliveryJobList).hasSize(databaseSizeBeforeUpdate);
        DeliveryJob testDeliveryJob = deliveryJobList.get(deliveryJobList.size() - 1);
        assertThat(testDeliveryJob.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testDeliveryJob.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
        assertThat(testDeliveryJob.getLatitude()).isEqualTo(UPDATED_LATITUDE);
    }

    @Test
    @Transactional
    public void updateNonExistingDeliveryJob() throws Exception {
        int databaseSizeBeforeUpdate = deliveryJobRepository.findAll().size();

        // Create the DeliveryJob

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restDeliveryJobMockMvc.perform(put("/api/delivery-jobs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(deliveryJob)))
            .andExpect(status().isCreated());

        // Validate the DeliveryJob in the database
        List<DeliveryJob> deliveryJobList = deliveryJobRepository.findAll();
        assertThat(deliveryJobList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteDeliveryJob() throws Exception {
        // Initialize the database
        deliveryJobRepository.saveAndFlush(deliveryJob);
        int databaseSizeBeforeDelete = deliveryJobRepository.findAll().size();

        // Get the deliveryJob
        restDeliveryJobMockMvc.perform(delete("/api/delivery-jobs/{id}", deliveryJob.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<DeliveryJob> deliveryJobList = deliveryJobRepository.findAll();
        assertThat(deliveryJobList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DeliveryJob.class);
    }
}

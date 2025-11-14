package com.hospital;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * This is the main test class for the application.
 * It's a simple integration test that checks if the Spring application context can start successfully.
 */
@SpringBootTest // This annotation tells Spring Boot to load the entire application context for this test.
class HospitalBackendApplicationTests {

    /**
     * This test method will pass if the application context loads without any errors.
     * The body of the method is intentionally left empty.
     */
    @Test
    void contextLoads() {
    }

}

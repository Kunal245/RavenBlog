package com.ravenblog;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class RavenBlogApplicationTests {

    @Test
    void applicationContextStarts() {
        // The test passing proves the embedded web server, JPA mapping, and security configuration start.
    }
}

package app.sportahub.eventservice.config.logging;

import static org.junit.Assert.assertNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.MDC;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;






public class RequestIdFilterTest {

    private final RequestIdFilter requestIdFilter = new RequestIdFilter();

    @BeforeEach
    void setUp() {
        MDC.clear();
    }



    @Test
    void testDoFilter_NullRequestId() throws ServletException, IOException {
        
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/test");
        MockHttpServletResponse response = new MockHttpServletResponse();

        FilterChain chain = new FilterChain() {
            @Override
            public void doFilter(ServletRequest request, ServletResponse response)
                    throws IOException, ServletException {
                String requestId = MDC.get("request_id");
                assertNotNull(requestId);
                assertFalse(requestId.isEmpty());
            }
        };

        requestIdFilter.doFilter(request, response, chain);

        assertNull(MDC.get("request_id"));
    }


    @Test
    void testDoFilter_SetsRequestIdFromHeader() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/test");
        request.addHeader("request_id", "test-request-id");
        MockHttpServletResponse response = new MockHttpServletResponse();

        FilterChain chain = new FilterChain() {
            @Override
            public void doFilter(ServletRequest request, ServletResponse response)
                    throws IOException, ServletException {
                String requestId = MDC.get("request_id");
                assertEquals("test-request-id", requestId);
            }
        };

        requestIdFilter.doFilter(request, response, chain);

        assertNull(MDC.get("request_id"));
    }

    @Test
    void testDoFilter_GeneratesRequestIdWhenHeaderMissing() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/test");
        MockHttpServletResponse response = new MockHttpServletResponse();

        FilterChain chain = new FilterChain() {
            @Override
            public void doFilter(ServletRequest request, ServletResponse response)
                    throws IOException, ServletException {
                String requestId = MDC.get("request_id");
                assertNotNull(requestId);
                assertFalse(requestId.isEmpty());
            }
        };

        requestIdFilter.doFilter(request, response, chain);

        assertNull(MDC.get("request_id"));
    }

    @Test
    void testDoFilter_ClearsMDC_EvenWhenExceptionThrown() {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/error");
        MockHttpServletResponse response = new MockHttpServletResponse();

        FilterChain chain = (req, res) -> {
            String requestId = MDC.get("request_id");
            assertNotNull(requestId);
            throw new ServletException("Forced Exception");
        };

        ServletException thrown = assertThrows(ServletException.class, () ->
            requestIdFilter.doFilter(request, response, chain)
        );
        assertEquals("Forced Exception", thrown.getMessage());

        assertNull(MDC.get("request_id"));
        
        assertTrue(MDC.getCopyOfContextMap() == null || MDC.getCopyOfContextMap().isEmpty());
    }
}
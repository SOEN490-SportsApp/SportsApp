package app.sportahub.userservice.config.logging;

import static org.junit.Assert.assertNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

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

public class EndpointFilterTest {

    private final EndpointFilter endpointFilter = new EndpointFilter();


    @BeforeEach
    void setUp() {
        MDC.clear();
    }

    @Test
    void testDoFilter_notHttpServletRequest() throws IOException, ServletException {
        ServletRequest request = mock(ServletRequest.class);
        ServletResponse response = mock(ServletResponse.class);
        FilterChain chain = mock(FilterChain.class);

        endpointFilter.doFilter(request, response, chain);

        verify(chain).doFilter(request, response);
        assertNull(MDC.get("endpoint"));
    }
    
    @Test
    void testDoFilter_SetsAndClearsMDC() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/test");
        MockHttpServletResponse response = new MockHttpServletResponse();

        FilterChain chain = new FilterChain() {
            @Override
            public void doFilter(ServletRequest request, ServletResponse response)
                    throws IOException, ServletException {
                String endpoint = MDC.get("endpoint");
                assertEquals("GET /test", endpoint);
            }
        };

        endpointFilter.doFilter(request, response, chain);

        assertNull(MDC.get("endpoint"));
    }

    @Test
    void testDoFilter_ClearsMDC_EvenWhenExceptionThrown() {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/error");
        MockHttpServletResponse response = new MockHttpServletResponse();

        FilterChain chain = (req, res) -> {
            String mdcValue = MDC.get("endpoint");
            assertEquals("POST /error", mdcValue);
            throw new ServletException("Forced Exception");
        };

        ServletException thrown = assertThrows(ServletException.class, () ->
            endpointFilter.doFilter(request, response, chain)
        );
        assertEquals("Forced Exception", thrown.getMessage());

        System.out.println(MDC.get("endpoint"));
        assertNull(MDC.get("endpoint"));
        
        assertTrue(MDC.getCopyOfContextMap() == null || MDC.getCopyOfContextMap().isEmpty());
    }

}

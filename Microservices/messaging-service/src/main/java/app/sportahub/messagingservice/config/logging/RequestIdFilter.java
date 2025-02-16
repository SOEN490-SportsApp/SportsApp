package app.sportahub.messagingservice.config.logging;

import java.io.IOException;
import org.springframework.stereotype.Component;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

import org.slf4j.MDC;
import java.util.UUID;

@Component
public class RequestIdFilter implements Filter{

    private static final String REQUEST_ID_HEADER = "request_id";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        if (request instanceof HttpServletRequest) {
            HttpServletRequest httpRequest = (HttpServletRequest) request;

            String requestId = httpRequest.getHeader(REQUEST_ID_HEADER);
            if (requestId == null || requestId.isEmpty()) {
                requestId = UUID.randomUUID().toString();
            }

            MDC.put(REQUEST_ID_HEADER, requestId);

            try {
                chain.doFilter(request, response);
            } finally {
                MDC.remove(REQUEST_ID_HEADER); 
            }
        }
    }
}

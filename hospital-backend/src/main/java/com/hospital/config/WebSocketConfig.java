package com.hospital.config;

import com.hospital.service.SignalingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final SignalingService signalingService;

    // Best practice: Use constructor injection for dependencies
    @Autowired
    public WebSocketConfig(SignalingService signalingService) {
        this.signalingService = signalingService;
    }

    /**
     * Registers the WebSocket handler that will process signaling messages.
     * @param registry The registry to add the handler to.
     */
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // Map the '/ws' endpoint to our SignalingService handler.
        // setAllowedOrigins("*") is crucial for allowing your React SPA (e.g., from localhost:3000)
        // to connect to this WebSocket server (e.g., on localhost:8080).
        registry.addHandler(signalingService, "/ws").setAllowedOrigins("*");
    }
}


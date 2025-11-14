package com.hospital.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SignalingService extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(SignalingService.class);
    // A thread-safe map to store sessions, mapping a unique session ID to the WebSocketSession
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    // A map to find the peer's session ID
    private final Map<String, String> peerMap = new ConcurrentHashMap<>();


    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // Example: ws://localhost:8080/ws?sessionId=user1-session-abc&peerId=user2-session-abc
        String sessionId = getSessionId(session);
        String peerId = getPeerId(session);

        if(sessionId == null || sessionId.isEmpty()){
            logger.warn("Session connected with no sessionId. Closing.");
            session.close();
            return;
        }

        sessions.put(sessionId, session);
        if(peerId != null && !peerId.isEmpty()) {
            peerMap.put(sessionId, peerId);
            peerMap.put(peerId, sessionId);
        }

        logger.info("WebSocket connection established with session ID: {}", sessionId);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String senderSessionId = getSessionId(session);
        String peerSessionId = peerMap.get(senderSessionId);

        if (peerSessionId != null) {
            WebSocketSession peerSession = sessions.get(peerSessionId);
            if (peerSession != null && peerSession.isOpen()) {
                try {
                    peerSession.sendMessage(message);
                    logger.info("Relayed message from {} to {}", senderSessionId, peerSessionId);
                } catch (IOException e) {
                    logger.error("Error sending message to peer {}", peerSessionId, e);
                }
            } else {
                logger.warn("Peer session {} not found or closed for sender {}", peerSessionId, senderSessionId);
            }
        } else {
            logger.warn("No peer found for session {}", senderSessionId);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String sessionId = getSessionId(session);
        if (sessionId != null) {
            sessions.remove(sessionId);
            String peerId = peerMap.remove(sessionId);
            if (peerId != null) {
                peerMap.remove(peerId);
            }
            logger.info("WebSocket connection closed for session ID: {}. Status: {}", sessionId, status);
        }
    }

    private String getSessionId(WebSocketSession session) {
        return getQueryParam(session, "sessionId");
    }

    private String getPeerId(WebSocketSession session) {
        return getQueryParam(session, "peerId");
    }

    private String getQueryParam(WebSocketSession session, String paramName) {
        if (session.getUri() == null) return null;
        String query = session.getUri().getQuery();
        if (query == null) return null;

        for (String param : query.split("&")) {
            String[] pair = param.split("=");
            if (pair.length > 1 && paramName.equals(pair[0])) {
                return pair[1];
            }
        }
        return null;
    }
}

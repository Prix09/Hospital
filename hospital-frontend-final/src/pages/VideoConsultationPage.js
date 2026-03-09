import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Helper to strip existing "Dr." prefix (in case DB name already contains it)
function formatDoctorName(name) {
    if (!name) return name;
    return name.replace(/^Dr\.?\s+/i, '').trim();
}

export default function VideoConsultationPage() {
    const { appointmentId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const pcRef = useRef(null);
    const bcRef = useRef(null);
    const localStreamRef = useRef(null);
    const mySessionIdRef = useRef(`${user?.id || 'u'}-apt-${appointmentId}-${Date.now()}`);
    const joinIntervalRef = useRef(null);

    const [status, setStatus] = useState('Starting camera...');
    const [isMuted, setIsMuted] = useState(false);
    const [isCamOff, setIsCamOff] = useState(false);
    const [connected, setConnected] = useState(false);

    const roomId = `room-apt-${appointmentId}`;
    const mySessionId = mySessionIdRef.current;

    const cleanup = useCallback(() => {
        if (joinIntervalRef.current) {
            clearInterval(joinIntervalRef.current);
            joinIntervalRef.current = null;
        }
        if (bcRef.current) { try { bcRef.current.close(); } catch(e){} }
        if (pcRef.current) { try { pcRef.current.close(); } catch(e){} }
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(t => t.stop());
        }
    }, []);

    useEffect(() => {
        startCall();
        return cleanup;
    }, []);

    const setupWebRTC = useCallback((stream) => {
        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
            ]
        });
        pcRef.current = pc;

        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        pc.ontrack = (event) => {
            if (remoteVideoRef.current && event.streams?.[0]) {
                remoteVideoRef.current.srcObject = event.streams[0];
                setConnected(true);
                setStatus('Connected ✅');
                // Stop the repeated join announcements once connected
                if (joinIntervalRef.current) {
                    clearInterval(joinIntervalRef.current);
                    joinIntervalRef.current = null;
                }
            }
        };

        pc.onicecandidate = (event) => {
            if (event.candidate && bcRef.current) {
                bcRef.current.postMessage({
                    type: 'candidate',
                    candidate: event.candidate.toJSON(),
                    from: mySessionId
                });
            }
        };

        pc.onconnectionstatechange = () => {
            if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
                setConnected(false);
                setStatus('Peer disconnected.');
            }
        };

        const bc = new BroadcastChannel(roomId);
        bcRef.current = bc;

        bc.onmessage = async (event) => {
            const msg = event.data;
            if (msg.from === mySessionId) return;

            try {
                if (msg.type === 'join') {
                    // Only the peer with the higher sessionId initiates the offer
                    // This prevents both peers from creating offers simultaneously
                    if (mySessionId > msg.from) {
                        if (pc.signalingState !== 'stable') return;
                        setStatus('Peer found! Initiating call...');
                        const offer = await pc.createOffer();
                        await pc.setLocalDescription(offer);
                        bc.postMessage({ type: 'offer', sdp: pc.localDescription.toJSON(), from: mySessionId });
                    } else {
                        // I'm the answerer — just acknowledge so caller knows I'm here
                        bc.postMessage({ type: 'ready', from: mySessionId });
                    }
                } else if (msg.type === 'ready') {
                    // Caller received "ready" from answerer — send offer if not already negotiating
                    if (mySessionId > msg.from && pc.signalingState === 'stable') {
                        setStatus('Peer ready! Calling...');
                        const offer = await pc.createOffer();
                        await pc.setLocalDescription(offer);
                        bc.postMessage({ type: 'offer', sdp: pc.localDescription.toJSON(), from: mySessionId });
                    }
                } else if (msg.type === 'offer') {
                    if (pc.signalingState !== 'stable') return;
                    await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);
                    bc.postMessage({ type: 'answer', sdp: pc.localDescription.toJSON(), from: mySessionId });
                    setStatus('Answering...');
                } else if (msg.type === 'answer') {
                    if (pc.signalingState !== 'have-local-offer') return;
                    await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
                } else if (msg.type === 'candidate') {
                    if (pc.remoteDescription) {
                        await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
                    }
                }
            } catch (err) {
                console.warn('WebRTC message error:', err.message);
            }
        };

        // Announce presence repeatedly every 2s until connected
        // This ensures late-joining peers still receive the announcement
        const announceJoin = () => {
            if (joinIntervalRef.current && bcRef.current) {
                try {
                    bcRef.current.postMessage({ type: 'join', from: mySessionId });
                } catch (e) {
                    // Channel might be closed during navigation
                    if (joinIntervalRef.current) {
                        clearInterval(joinIntervalRef.current);
                        joinIntervalRef.current = null;
                    }
                }
            }
        };

        setStatus('Camera ready. Waiting for peer...');
        announceJoin(); // immediate first announce
        joinIntervalRef.current = setInterval(announceJoin, 2000);

    }, [mySessionId, roomId]);

    const startCall = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            setupWebRTC(stream);
        } catch (err) {
            setStatus('❌ Camera access denied. Please allow camera/microphone access and refresh.');
        }
    };

    const toggleMute = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
            setIsMuted(prev => !prev);
        }
    };

    const toggleCam = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach(t => { t.enabled = !t.enabled; });
            setIsCamOff(prev => !prev);
        }
    };

    const endCall = () => {
        cleanup();
        navigate('/appointments');
    };

    const displayName = user?.name ? formatDoctorName(user.name) : (user?.username || 'Me');

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            fontFamily: 'Inter, sans-serif',
        }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    🎥 Video Consultation — Appointment #{appointmentId}
                </h1>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    color: connected ? '#34d399' : '#94a3b8',
                    fontSize: '0.9rem',
                    background: 'rgba(255,255,255,0.07)',
                    padding: '0.4rem 1.2rem',
                    borderRadius: '20px',
                    border: `1px solid ${connected ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.1)'}`,
                }}>
                    <span style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: connected ? '#34d399' : '#f59e0b',
                        animation: connected ? 'none' : 'pulse 1.5s infinite',
                    }} />
                    {status}
                </div>
            </div>

            {/* Info tip */}
            {!connected && (
                <div style={{
                    background: 'rgba(99,102,241,0.12)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    borderRadius: '12px',
                    padding: '0.7rem 1.5rem',
                    marginBottom: '1.5rem',
                    color: '#a5b4fc',
                    fontSize: '0.82rem',
                    textAlign: 'center',
                    maxWidth: '600px',
                }}>
                    💡 Open this same URL in a <strong>second browser tab</strong> to simulate patient + doctor connection
                </div>
            )}

            {/* Video Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                width: '100%',
                maxWidth: '900px',
                marginBottom: '1.5rem',
            }}>
                {/* Local Video */}
                <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', background: '#0f172a' }}>
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        style={{
                            width: '100%',
                            display: 'block',
                            aspectRatio: '16/9',
                            objectFit: 'cover',
                            borderRadius: '16px',
                            border: '2px solid rgba(99,102,241,0.5)',
                        }}
                    />
                    <span style={{
                        position: 'absolute', bottom: '0.75rem', left: '0.75rem',
                        background: 'rgba(0,0,0,0.75)', color: '#fff',
                        padding: '0.25rem 0.7rem', borderRadius: '8px', fontSize: '0.8rem',
                        backdropFilter: 'blur(4px)',
                    }}>
                        👤 {displayName} (You) {isMuted ? '🔇' : ''}{isCamOff ? ' 📷✕' : ''}
                    </span>
                </div>

                {/* Remote Video */}
                <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', background: '#0f172a' }}>
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        style={{
                            width: '100%',
                            display: 'block',
                            aspectRatio: '16/9',
                            objectFit: 'cover',
                            borderRadius: '16px',
                            border: `2px solid ${connected ? '#34d399' : 'rgba(255,255,255,0.1)'}`,
                        }}
                    />
                    {!connected && (
                        <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexDirection: 'column', gap: '0.75rem', background: 'rgba(15,23,42,0.85)',
                        }}>
                            <div style={{
                                width: '3rem', height: '3rem', borderRadius: '50%',
                                border: '3px solid rgba(99,102,241,0.4)',
                                borderTopColor: '#6366f1',
                                animation: 'spin 1s linear infinite',
                            }} />
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center' }}>
                                Waiting for other participant...
                            </p>
                        </div>
                    )}
                    {connected && (
                        <span style={{
                            position: 'absolute', bottom: '0.75rem', left: '0.75rem',
                            background: 'rgba(0,0,0,0.75)', color: '#34d399',
                            padding: '0.25rem 0.7rem', borderRadius: '8px', fontSize: '0.8rem',
                            backdropFilter: 'blur(4px)',
                        }}>
                            👤 Remote Participant
                        </span>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <button
                    onClick={toggleMute}
                    title={isMuted ? 'Unmute' : 'Mute'}
                    style={{
                        width: '3.5rem', height: '3.5rem', borderRadius: '50%',
                        border: 'none', cursor: 'pointer', fontSize: '1.3rem',
                        background: isMuted ? '#ef4444' : 'rgba(255,255,255,0.15)',
                        color: '#fff', transition: 'all 0.2s',
                        boxShadow: isMuted ? '0 4px 12px rgba(239,68,68,0.4)' : 'none',
                    }}
                >{isMuted ? '🔇' : '🎤'}</button>

                <button
                    onClick={endCall}
                    title="End Call"
                    style={{
                        width: '4.5rem', height: '4.5rem', borderRadius: '50%',
                        border: 'none', cursor: 'pointer', fontSize: '1.5rem',
                        background: '#ef4444', color: '#fff',
                        boxShadow: '0 4px 20px rgba(239,68,68,0.5)',
                        transition: 'all 0.2s',
                    }}
                >📵</button>

                <button
                    onClick={toggleCam}
                    title={isCamOff ? 'Turn Camera On' : 'Turn Camera Off'}
                    style={{
                        width: '3.5rem', height: '3.5rem', borderRadius: '50%',
                        border: 'none', cursor: 'pointer', fontSize: '1.3rem',
                        background: isCamOff ? '#ef4444' : 'rgba(255,255,255,0.15)',
                        color: '#fff', transition: 'all 0.2s',
                        boxShadow: isCamOff ? '0 4px 12px rgba(239,68,68,0.4)' : 'none',
                    }}
                >{isCamOff ? '📷' : '📸'}</button>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
            `}</style>
        </div>
    );
}

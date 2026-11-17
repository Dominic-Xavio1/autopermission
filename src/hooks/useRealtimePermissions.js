'use client';

import { useEffect, useState, useRef } from 'react';

export const playNotificationChime = (type) => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'alert') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(554.37, now + 0.12);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch {
    // Audio synthesis unsupported or blocked
  }
};

export function useRealtimePermissions({
  onNewRequest,
  onStatusChanged,
  onRequestDeleted,
  activeRole,
  userEmail,
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [latestToast, setLatestToast] = useState(null);

  const callbacksRef = useRef({
    onNewRequest,
    onStatusChanged,
    onRequestDeleted,
    activeRole,
    userEmail,
  });

  useEffect(() => {
    callbacksRef.current = {
      onNewRequest,
      onStatusChanged,
      onRequestDeleted,
      activeRole,
      userEmail,
    };
  }, [onNewRequest, onStatusChanged, onRequestDeleted, activeRole, userEmail]);

  useEffect(() => {
    let eventSource = null;
    let retryTimer = null;

    const connect = () => {
      try {
        eventSource = new EventSource('/api/events');

        eventSource.addEventListener('connected', () => {
          setIsConnected(true);
        });

        eventSource.addEventListener('message', (event) => {
          try {
            const data = JSON.parse(event.data);
            const { type, payload } = data;
            const {
              onNewRequest: handleNew,
              onStatusChanged: handleStatus,
              onRequestDeleted: handleDelete,
              activeRole: role,
              userEmail: email,
            } = callbacksRef.current;

            if (type === 'NEW_REQUEST') {
              if (handleNew) handleNew(payload);

              if (role === 'admin') {
                playNotificationChime('alert');
                setLatestToast({
                  id: String(Date.now()),
                  title: 'New Permission Request Submitted',
                  message: `${payload.teacherName} (${payload.department}) requested: ${payload.duration}`,
                  type: 'alert',
                });
              }
            } else if (type === 'STATUS_CHANGED') {
              if (handleStatus) handleStatus(payload);

              if (role === 'teacher' && payload.teacherEmail === email) {
                const isApproved = payload.status === 'approved';
                playNotificationChime(isApproved ? 'success' : 'alert');
                setLatestToast({
                  id: String(Date.now()),
                  title: isApproved ? 'Permission Approved!' : 'Permission Request Update',
                  message: isApproved
                    ? `Your request for ${payload.requestDate} was approved by ${payload.reviewerName || 'Administration'}.`
                    : `Your request for ${payload.requestDate} was declined. Note: ${payload.reviewerNote || 'Review in portal'}`,
                  type: isApproved ? 'success' : 'alert',
                });
              }
            } else if (type === 'REQUEST_DELETED') {
              if (handleDelete) handleDelete(payload);
            }
          } catch (err) {
            console.error('Error handling event message:', err);
          }
        });

        eventSource.onerror = () => {
          setIsConnected(false);
          eventSource?.close();
          retryTimer = setTimeout(connect, 3000);
        };
      } catch (err) {
        console.warn('EventSource initialization failed:', err);
        setIsConnected(false);
      }
    };

    connect();

    return () => {
      if (retryTimer) clearTimeout(retryTimer);
      if (eventSource) eventSource.close();
    };
  }, []);

  const clearToast = () => setLatestToast(null);

  return { isConnected, latestToast, clearToast };
}

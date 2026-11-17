import { EventEmitter } from 'events';

export const getEventBus = () => {
  if (!global._realtimeBus) {
    global._realtimeBus = new EventEmitter();
    global._realtimeBus.setMaxListeners(100);
  }
  return global._realtimeBus;
};

export const emitRealtimeEvent = (type, payload) => {
  try {
    const bus = getEventBus();
    const message = {
      type,
      payload,
      timestamp: new Date().toISOString(),
    };
    bus.emit('permission-update', message);
  } catch (error) {
    console.warn('Realtime event dispatch error:', error);
  }
};

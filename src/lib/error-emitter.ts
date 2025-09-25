
import { EventEmitter } from 'events';

// This is a global event emitter to handle specific app-wide events, like permission errors.
export const errorEmitter = new EventEmitter();

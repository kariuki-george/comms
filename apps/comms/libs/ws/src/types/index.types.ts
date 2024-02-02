import socketio from 'socket.io';

export type AuthenticatedSocket = socketio.Socket & { user: any };

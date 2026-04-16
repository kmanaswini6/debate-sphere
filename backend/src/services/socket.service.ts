import { Server, Socket } from 'socket.io';
import { Debate } from '../models/Debate';

interface DebateRoom {
  debateId: string;
  participants: Set<string>;
  spectators: Set<string>;
  timerInterval?: NodeJS.Timeout;
}

const rooms: Map<string, DebateRoom> = new Map();

export const initializeSocket = (io: Server): void => {
  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Join a debate room
    socket.on('debate:join', async ({ debateId, userId }: { debateId: string; userId: string }) => {
      try {
        const debate = await Debate.findById(debateId);
        if (!debate) {
          socket.emit('debate:error', { message: 'Debate not found' });
          return;
        }

        socket.join(debateId);

        if (!rooms.has(debateId)) {
          rooms.set(debateId, {
            debateId,
            participants: new Set(),
            spectators: new Set(),
          });
        }

        const room = rooms.get(debateId)!;
        const isParticipant = debate.participants.some(p => p.toString() === userId);

        if (isParticipant) {
          room.participants.add(socket.id);
        } else {
          room.spectators.add(socket.id);
        }

        // Notify others
        socket.to(debateId).emit('debate:user_joined', {
          userId,
          isParticipant,
          participantCount: room.participants.size,
          spectatorCount: room.spectators.size,
        });

        // Send current state to the user
        socket.emit('debate:state', {
          debate: {
            ...debate.toObject(),
            _id: debate._id,
          },
          participantCount: room.participants.size,
          spectatorCount: room.spectators.size,
        });

        console.log(`📡 User ${userId} joined debate ${debateId}`);
      } catch (error) {
        console.error('Error joining debate:', error);
        socket.emit('debate:error', { message: 'Failed to join debate' });
      }
    });

    // New argument submitted
    socket.on('debate:argument', ({ debateId, message }: { debateId: string; message: any }) => {
      socket.to(debateId).emit('debate:new_argument', message);
      console.log(`💬 New argument in debate ${debateId}`);
    });

    // Vote submitted
    socket.on('debate:vote_update', ({ debateId, votes }: { debateId: string; votes: { pro: number; con: number } }) => {
      io.to(debateId).emit('debate:votes_updated', votes);
    });

    // Round changed
    socket.on('debate:round_changed', ({ debateId, round, timeRemaining }: { debateId: string; round: string; timeRemaining: number }) => {
      io.to(debateId).emit('debate:round_changed', { round, timeRemaining });
    });

    // Timer tick (for synchronization)
    socket.on('debate:timer_tick', ({ debateId, timeRemaining }: { debateId: string; timeRemaining: number }) => {
      socket.to(debateId).emit('debate:timer_tick', timeRemaining);
    });

    // User left
    socket.on('disconnect', () => {
      rooms.forEach((room, debateId) => {
        room.participants.delete(socket.id);
        room.spectators.delete(socket.id);

        socket.to(debateId).emit('debate:user_left', {
          socketId: socket.id,
          participantCount: room.participants.size,
          spectatorCount: room.spectators.size,
        });

        // Clean up empty rooms
        if (room.participants.size === 0 && room.spectators.size === 0) {
          rooms.delete(debateId);
        }
      });

      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
};

export const getRoomStats = (debateId: string): { participants: number; spectators: number } | null => {
  const room = rooms.get(debateId);
  if (!room) return null;

  return {
    participants: room.participants.size,
    spectators: room.spectators.size,
  };
};

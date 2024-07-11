import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';

export async function getTrips(app: FastifyInstance) {
  app.get('/trips', async () => {
    const trips = await prisma.trip.findMany();
    return { trips };
  });
}

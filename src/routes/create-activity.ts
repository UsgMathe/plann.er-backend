import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { ClientError } from '../errors/cllient-error';
import { dayjs } from '../lib/dayjs';
import { prisma } from '../lib/prisma';

export async function createActivity(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/trips/:tripId/activities',
    {
      schema: {
        params: z.object({ tripId: z.string().uuid() }),
        body: z.object({
          title: z.string().min(4),
          occours_at: z.coerce.date(),
        }),
      },
    },
    async request => {
      const { tripId } = request.params;
      const { title, occours_at } = request.body;

      const trip = await prisma.trip.findUnique({ where: { id: tripId } });

      if (!trip) throw new ClientError('Trip not found.');

      const { starts_at, ends_at } = trip;

      if (
        dayjs(occours_at).isBefore(starts_at) ||
        dayjs(occours_at).isAfter(ends_at)
      )
        throw new ClientError('Invalid activity date.');

      const activity = await prisma.activity.create({
        data: { title, occours_at, trip_id: tripId },
      });

      return { activityId: activity.id };
    }
  );
}

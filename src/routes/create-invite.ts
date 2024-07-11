import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getTestMessageUrl } from 'nodemailer';
import z from 'zod';
import { env } from '../env';
import { ClientError } from '../errors/cllient-error';
import { dayjs } from '../lib/dayjs';
import { getMailClient } from '../lib/mail';
import { prisma } from '../lib/prisma';

export async function createInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/trips/:tripId/invites',
    {
      schema: {
        params: z.object({ tripId: z.string().uuid() }),
        body: z.object({
          email: z.string().email(),
        }),
      },
    },
    async request => {
      const { tripId } = request.params;
      const { email } = request.body;

      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
      });

      if (!trip) throw new ClientError('Trip not found.');

      const { starts_at, ends_at, destination } = trip;

      const participant = await prisma.participants.create({
        data: { email, trip_id: tripId },
      });

      const isSameMounth = dayjs(starts_at).month() == dayjs(ends_at).month();

      const formatedStartDateSubject = dayjs(starts_at).format('LL');

      const formatedStartDateBody = isSameMounth
        ? dayjs(starts_at).date()
        : dayjs(starts_at).format('D [de] MMMM');

      const formatedEndDate = dayjs(ends_at).format('LL');

      const mail = await getMailClient();

      const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`;

      const message = await mail.sendMail({
        from: { name: 'Equipe Plann.er', address: 'oi@plann.er' },
        to: email,
        subject: `Confirme sua presença na viagem para ${destination} em ${formatedStartDateSubject}`,
        html: `
                <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6">
                  <p>
                    Você foi convidado(a) para participar de uma viagem para
                    <strong>${destination}</strong> nas datas de
                    <strong>${formatedStartDateBody}</strong> até <strong>${formatedEndDate}.</strong>
                  </p>
                  <p></p>
                  <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
                  <p></p>
                  <p>
                    <a href="${confirmationLink}">Confirmar presença</a>
                  </p>
                  <p></p>
                  <p>
                    Caso você não saiba do que se trata, apenas ignore esse e-mail.
                  </p>
                </div>
            `,
      });

      console.log(getTestMessageUrl(message));

      return { participantId: participant.id };
    }
  );
}

import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getTestMessageUrl } from 'nodemailer';
import z from 'zod';
import { env } from '../env';
import { ClientError } from '../errors/cllient-error';
import { dayjs } from '../lib/dayjs';
import { getMailClient } from '../lib/mail';
import { prisma } from '../lib/prisma';

export async function confirmTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/trips/:tripId/confirm',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { tripId } = request.params;

      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
        include: { participants: { where: { is_owner: false } } },
      });

      if (!trip) throw new ClientError('Trip not found.');

      const { is_confirmed, starts_at, ends_at, destination, participants } =
        trip;

      if (is_confirmed)
        return reply.redirect(`${env.WEB_BASE_URL}/trips/${tripId}`);

      await prisma.trip.update({
        where: { id: tripId },
        data: { is_confirmed: true },
      });

      const isSameMounth = dayjs(starts_at).month() == dayjs(ends_at).month();

      const formatedStartDateSubject = dayjs(starts_at).format('LL');

      const formatedStartDateBody = isSameMounth
        ? dayjs(starts_at).date()
        : dayjs(starts_at).format('D [de] MMMM');

      const formatedEndDate = dayjs(ends_at).format('LL');

      const mail = await getMailClient();

      Promise.all(
        participants.map(async ({ name, email, id }) => {
          const confirmationLink = `${env.API_BASE_URL}participants/${id}/confirm`;

          const message = await mail.sendMail({
            from: { name: 'Equipe Plann.er', address: 'oi@plann.er' },
            to: name ? { name, address: email } : email,
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
        })
      );
      return reply.redirect(`${env.WEB_BASE_URL}/trips/${tripId}`);
    }
  );
}

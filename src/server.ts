import cors from '@fastify/cors';
import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { errorHandler } from './error-handler';
import { createActivity } from './routes/create-activity';
import { getActivities } from './routes/get-activities';
import { createLink } from './routes/create-link';
import { getLinks } from './routes/get-links';
import { confirmParticipant } from './routes/confirm-participant';
import { getParticipant } from './routes/get-participant';
import { getParticipants } from './routes/get-participants';
import { confirmTrip } from './routes/confirm-trip';
import { createInvite } from './routes/create-invite';
import { createTrip } from './routes/create-trip';
import { getTripDetails } from './routes/get-trip-details';
import { getTrips } from './routes/get-trips';
import { updateTrip } from './routes/update-trip';
import { env } from './env';

const app = fastify();

app.setErrorHandler(errorHandler);
app.register(cors, { origin: '*' });

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip);
app.register(createActivity);
app.register(createLink);
app.register(createInvite);
app.register(updateTrip);
app.register(confirmTrip);
app.register(confirmParticipant);
app.register(getTrips);
app.register(getActivities);
app.register(getLinks);
app.register(getParticipants);
app.register(getTripDetails);
app.register(getParticipant);

app.listen({ port: env.PORT }).then(() => {
  console.log('🔥 Server is runing!');
});

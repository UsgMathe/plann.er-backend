
npm init -y 
npm i typescript @types/node -D 


- Criar arquivo tsconfig.json:

  npx tsx --init  


tsconfig bases -> https://www.npmjs.com/package/@tsconfig/node20


- tsconfig.json:

  {
    "$schema": "https://json.schemastore.org/tsconfig",
    "_version": "20.1.0",

    "compilerOptions": {
      "lib": ["es2023"],
      "module": "node16",
      "target": "es2022",

      "strict": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "moduleResolution": "node16"
    }
  }


npm i tsx -D
npx tsx watch src/server.ts


- Framework:

  npm i fastify


- Banco de dados:

  npm i prisma -D
  npx prisma init --datasource-provider SQLite


- Criação de Schemas PRISMA:

  model NomeTabela {
    id String @id @default(uuid())

    @@map("nomeTabela")
  }


- Criar tabela no arquivo db
    npx prisma migrate dev

    ? Enter a name for the new migration: » create nomeTabela table


- Configurar prisma './utils/prisma.ts'
  import { PrismaClient } from '@prisma/client';

  export const prisma = new PrismaClient({
    log: ['query'],
  });


app.get('/cadastrar', async () => {
  return await prisma.trip
    .create({
      data: {
        destination: 'Rio Azul',
        starts_at: new Date(),
        ends_at: new Date(),
      },
    })
    .then(() => 'Registro cadastrado com sucesso!')
    .catch(() => 'Falha ao cadastrar!');
});

app.get('/listar', async () => {
  return await prisma.trip
    .findMany()
    .then(data => data)
    .catch(error => error);
});


npm i zod
npm i fastify-type-provider-zod

https://github.com/turkerdev/fastify-type-provider-zod

export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/trips',
    {
      schema: {
        body: z.object({
          destination: z.string().min(4),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date(),
        }),
      },
    },
    async () => {
      return 'Hello World.';
    }
  );
}

- Rodar interface do Prisma
  npx prisma studio

- Lib para trabalhar com datas
  npm i dayjs

- Lib para envio de email
  npm i nodemailer
  npm i --save-dev @types/nodemailer

- CORS
  npm i @fastify/cors
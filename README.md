
# NodeJS Streams for Large-Scale Data Handling

When faced with the challenge of processing large volumes of data in NodeJS, streams offer an efficient and robust solution. This project showcases a practical, real-world use case where this technology was implemented to solve a significant data-handling problem.

1. Database Read Stream: A readable stream is opened directly from the database, consuming records sequentially without loading the entire dataset into memory.

2. CSV Transformation: The data flowing from the database is piped through a transform stream, which converts the records into CSV format on the fly.

3. Upload to S3: Finally, the resulting stream is piped to an S3 bucket, uploading the CSV file in chunks as it is being generated.
This approach not only solves the memory problem but also enhances performance by processing data in manageable fragments.

![Flujo de Datos de la Aplicación](https://raw.githubusercontent.com/gonzaldd/stream-nodejs/e0c321f5a14c9f16233ae812a146a849982fd1b2/doc/data-flow.jpg)

## Tech Stack

**Client:** React, TypeScript, Vite, TailwindCSS, Shadcn/ui, Radix UI, Lucide React, ESLint

**Server:** Node.js, NestJS, TypeScript, TypeORM, PostgreSQL, AWS S3 SDK, CSV Stringify, RxJS, Jest, Prettier

**Infrastructure:** Docker, Docker Compose, MinIO, PgAdmin, PNPM

## Quick Start with Docker

#### 1. Clone and Start Services
```bash
git clone https://github.com/gonzaldd/stream-nodejs.git
cd streams-node
```

#### 2. Create .env
Rename .env.example to .env & put your DB credentials

#### 3. Run Docker
```
docker-compose up --build
```

This will start all services:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **MinIO Console**: http://localhost:9001
- **pgAdmin**: http://localhost:5050
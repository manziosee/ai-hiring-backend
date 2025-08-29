import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors();

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('AI Hiring Platform API')
    .setDescription(
      'Intelligent recruitment platform with AI-powered candidate screening',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('App', 'Application information')
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management')
    .addTag('Jobs', 'Job posting management')
    .addTag('Candidates', 'Candidate profiles')
    .addTag('Applications', 'Job applications')
    .addTag('Screening', 'AI-powered screening')
    .addTag('Interviews', 'Interview scheduling')
    .addTag('Uploads', 'File upload endpoints')
    .addTag('File Upload', 'Legacy file upload')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // Enhanced health check endpoint
  app.getHttpAdapter().get('/health', async (req, res) => {
    const prismaService = app.get(PrismaService);

    // Check database connection
    let dbStatus = 'disconnected';
    try {
      await prismaService.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
    } catch (error) {
      console.error('Database health check failed:', error);
    }

    // Check ML service connection
    let mlServiceStatus = 'disconnected';
    try {
      const mlHealth = await fetch(
        `http://${process.env.ML_SERVICE_HOST || 'localhost'}:${process.env.ML_SERVICE_PORT || '8000'}/health`,
      );
      if (mlHealth.ok) {
        mlServiceStatus = 'connected';
      }
    } catch (error) {
      console.error('ML service health check failed:', error);
    }

    // Check email service connection (microservice)
    let emailServiceStatus = 'disconnected';
    try {
      const emailHealth = await fetch(
        `http://${process.env.EMAIL_SERVICE_HOST || 'localhost'}:${process.env.EMAIL_SERVICE_PORT || '3002'}/health`,
      );
      if (emailHealth.ok) {
        emailServiceStatus = 'connected';
      }
    } catch (error) {
      console.error('Email service health check failed:', error);
    }

    // Check Resend API status
    let resendStatus = 'configured';
    if (!process.env.RESEND_API_KEY) {
      resendStatus = 'not_configured';
    }

    // Check AI services status
    const openaiStatus = process.env.OPENAI_API_KEY
      ? 'configured'
      : 'not_configured';
    const huggingfaceStatus = process.env.HUGGINGFACE_API_KEY
      ? 'configured'
      : 'not_configured';

    const overallStatus = dbStatus === 'connected' ? 'healthy' : 'degraded';

    res.json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      service: 'ai-hiring-api',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: dbStatus,
        mlService: mlServiceStatus,
        emailService: emailServiceStatus,
        resend: resendStatus,
        openai: openaiStatus,
        huggingface: huggingfaceStatus,
      },
    });
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(
    `📚 API Documentation available at: http://localhost:${port}/api`,
  );
}

bootstrap();

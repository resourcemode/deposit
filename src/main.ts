import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Swagger/OpenAPI configuration
  const config = new DocumentBuilder()
    .setTitle('Time Deposit System API')
    .setDescription('RESTful API for managing time deposits with interest calculations based on plan types')
    .setVersion('1.0')
    .addTag('time-deposits', 'Time deposit management endpoints')
    .setContact('Time Deposit System', 'https://github.com/resourcemode/deposit', 'support@timedeposit.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Time Deposit API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  });

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
  console.log(`Swagger documentation available at: http://localhost:3000/api`);
}
bootstrap();

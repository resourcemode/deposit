import { NestFactory } from "@nestjs/core";
import { CommandModule, CommandService } from "nestjs-command";
import { CliModule } from "./cli.module";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(CliModule, {
    logger: ["error", "warn", "log"],
  });

  try {
    await app.select(CommandModule).get(CommandService).exec();
    await app.close();
  } catch (error) {
    console.error(error);
    await app.close();
    process.exit(1);
  }
}

bootstrap();

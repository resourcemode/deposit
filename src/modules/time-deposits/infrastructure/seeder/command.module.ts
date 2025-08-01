import { Module } from "@nestjs/common";
import { CommandModule } from "nestjs-command";
import { SeederModule } from "./seeder.module";
import { SeedCommand } from "./seeder.command";

@Module({
  imports: [CommandModule, SeederModule],
  providers: [SeedCommand],
  exports: [SeedCommand],
})
export class CliCommandModule {}

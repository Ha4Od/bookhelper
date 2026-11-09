import { ConfigService } from '@nestjs/config';
import {JwtModuleOptions} from "@nestjs/jwt";

export const getMongoConfig = async (configService: ConfigService) => ({
  uri: configService.getOrThrow<string>('MONGODB_URI'),
});


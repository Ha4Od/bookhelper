import { ConfigService } from '@nestjs/config';
import {JwtModuleOptions} from "@nestjs/jwt";

export const getMongoConfig = async (configService: ConfigService) => ({
  uri: configService.getOrThrow<string>('MONGODB_URI'),
});

export const getJwtConfig = async (configService: ConfigService): Promise<JwtModuleOptions> => ({
  secret: configService.getOrThrow<string>('JWT_SECRET'),
  signOptions: { expiresIn: "1h" },
})

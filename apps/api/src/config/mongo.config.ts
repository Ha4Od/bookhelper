import { ConfigService } from '@nestjs/config';

export const getMongoConfig = async (configService: ConfigService) => ({
  uri: configService.getOrThrow<string>('MONGODB_URI'),
});

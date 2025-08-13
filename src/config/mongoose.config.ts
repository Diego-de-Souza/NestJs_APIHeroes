import * as dotenv from 'dotenv';
import { MongooseModuleOptions } from '@nestjs/mongoose';

dotenv.config();

export const mongooseConfig: MongooseModuleOptions = {
  uri: process.env.MONGO_URL,
};
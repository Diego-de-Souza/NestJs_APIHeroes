import { HttpStatus } from "@nestjs/common";

export interface ApiResponseInterface<T = any> {
  status: HttpStatus;
  message: string;
  data?: T[]; 
  error?: string;
  dataUnit?: T | null; 
  user?: any;
}
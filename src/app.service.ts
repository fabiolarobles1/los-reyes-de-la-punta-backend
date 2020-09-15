import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'UPR ENROLLMENT SYSTEM API';
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getMessage(): string {
    return 'hiiii user';
  }

  sendMessage(data:any): any {
    return {message:"done",data};
  }
}

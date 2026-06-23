import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("getMessage")
  getMessage(): string {
    return this.appService.getMessage();
  }

  @Post()
  sendMessage(@Body() data:any):any{
    return this.appService.sendMessage(data)
  }
}

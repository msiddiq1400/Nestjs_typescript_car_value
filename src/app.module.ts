import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { APP_PIPE } from '@nestjs/core';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      database: 'car_value',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '12341234',
      entities: [User, Report],
      synchronize: true,
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      //use global pipe
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // remove extra unwanted data from requests
      }),
    },
  ],
})
export class AppModule {
  //this middleware will be running for every route (*)
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['asdasd'],
        }),
      )
      .forRoutes('*');
  }
}

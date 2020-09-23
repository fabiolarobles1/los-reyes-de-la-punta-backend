import { AuthModule } from './auth/auth.module';
import { StudentsModule } from './students/students.module';
import { StudentsController } from './students/students.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Database } from './config/database';
import { StudentsService } from './students/students.service';

@Module({
  imports: [
    AuthModule, 
    StudentsModule, 
    TypeOrmModule.forRootAsync({
      useClass: Database,
    })
  ],
  controllers: [
        StudentsController, AppController],
  providers: [
    AppService,
    StudentsService
  ],
})
export class AppModule {}

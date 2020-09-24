import { AuthModule } from './auth/auth.module';
import { StudentsModule } from './students/students.module';
import { StudentsController } from './students/students.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Database } from './config/database';
import { StudentsService } from './students/students.service';
import { AuthService } from './auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: Database,
    }),
    AuthModule, 
    StudentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

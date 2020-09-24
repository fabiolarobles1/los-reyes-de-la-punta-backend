import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { StudentsModule } from '../students/students.module';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
@Module({
    imports: [
        StudentsModule,
        PassportModule,
        JwtModule.register({
            secret: 'asdasdaswdasdas',
            signOptions: { expiresIn: '2 days' }
        })
    ],
    exports: [AuthService],
    providers: [
        AuthService,
        LocalStrategy
    ],
})
export class AuthModule {}

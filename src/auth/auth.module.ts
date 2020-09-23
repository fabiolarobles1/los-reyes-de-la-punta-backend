import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { StudentsModule } from '../students/students.module';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
@Module({
    imports: [
        JwtModule.register({
            secret: 'THIS_IS_MY_SECRET_KEY',
            signOptions: { expiresIn: '2 days' },
        }),
        StudentsModule,
        PassportModule
    ],
    controllers: [],
    providers: [
        AuthService,
        LocalStrategy
    ],
})
export class AuthModule {}

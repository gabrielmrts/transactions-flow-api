import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async signIn(email: string, password: string) {
        const account = await this.usersService.findByEmail(email);

        if (account?.password !== password) {
            throw new UnauthorizedException();
        }

        const payload = { sub: account.id, user_type: account.userType };

        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }
}

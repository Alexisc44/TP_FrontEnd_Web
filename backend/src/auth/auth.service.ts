import { Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
            private service: UsersService,
            private jwtService: JwtService
        ) {}

    public async validateUser(id: number, password: string) : Promise<User | undefined> {
        const user = await this.service.getById(id);
        if (!(await bcrypt.compare(password, user.password))) {
            return undefined;
        }
        return user;
    }

    async login(user: any) {
    const payload = { username: user.id };
    return {
        access_token: this.jwtService.sign(payload),
    };
}
}

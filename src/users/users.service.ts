import { Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async findByEmail(email: string): Promise<Account | undefined> {
        return this.prisma.account.findFirst({
            where: {
                email,
            }
        });
    }

    async findById(id: number): Promise<Account | undefined> {
        return this.prisma.account.findFirst({
            where: {
                id
            }
        });
    }
}

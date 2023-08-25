import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, Wallet } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WalletService {
    constructor(private prismaService: PrismaService) {}

    async getByAccountId(accountId: number): Promise<Wallet | undefined> {
        return await this.prismaService.wallet.findFirst({
            where: {
                accountId
            }
        }); 
    }

    async addBalance(prisma: Prisma.TransactionClient, walletId: number, ammount: number) {
        await prisma.wallet.update({
            where: {
                id: walletId
            },
            data: {
                balance: {
                    increment: ammount
                }
            }
        });
    }
    async discountBalance(prisma: Prisma.TransactionClient, walletId: number, ammount: number) {
        await prisma.wallet.update({
            where: {
                id: walletId,
                balance: {
                    gte: ammount
                },
            },
            data: {
                balance: {
                    decrement: ammount,
                }
            }
        });
    }
}

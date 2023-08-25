import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletService } from 'src/wallet/wallet.service';
import axios from 'axios';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TransactionService {
    constructor(
        private prismaService: PrismaService,
        private walletService: WalletService,
        private mailService: MailerService,
        private userService: UsersService
    ) {}

    async createTransaction(prisma: Prisma.TransactionClient,ammount: number, payerId: number, payeeId: number) {
        const transaction = await prisma.transaction.create({
            data: {
                ammount,
                payeeId,
                payerId
            }
        });

        await prisma.transactionHistory.create({
            data: {
                transactionId: transaction.id
            }
        });
    }    

    async transfer(ammount: number, payerId: number, payeeId: number) {
        return await this.prismaService.$transaction(async (tx) => {
            const payerWallet = await this.walletService.getByAccountId(payerId);
            const payeeWallet = await this.walletService.getByAccountId(payeeId);
            
            if (!payerWallet || !payeeWallet) {
                throw new HttpException('Wallet not found', HttpStatus.BAD_REQUEST);
            }
            
            if (payerWallet.balance === 0) {
                throw new HttpException('Insufficient balance to complete the transaction.', HttpStatus.BAD_REQUEST);
            }
            
            const payerAccount = await this.userService.findById(payerId);
            const canProcessTransaction = await this.canMakeTransaction();

            if (!canProcessTransaction) {
                throw new HttpException('External transaction authorization failed', HttpStatus.BAD_REQUEST);
            }

            // Discount ammount from the payer wallet
            await this.walletService.discountBalance(tx, payerWallet.id, ammount);    
            // Register the transaction
            await this.createTransaction(tx, ammount, payerId, payeeId);
            // Add value to payee wallet
            await this.walletService.addBalance(tx, payeeWallet.id, ammount);

            this.sendTransactionInformationEmail(payerAccount.email);
        });
    }

    async sendTransactionInformationEmail(to: string) {
        await this.mailService.sendMail({
            to,
            from: 'noreply@transactions.com',
            subject: 'Transaction Confirmation',
            template: 'transaction',
            context: {
                name: 'gabriel'
            },
        });
    }

    async canMakeTransaction(): Promise<boolean> {
        const url = "https://run.mocky.io/v3/8fafdd68-a090-496f-8c9a-3442cf30dae6";
        const response = await axios.get(url);

        return response.data.message == "Autorizado";
    }

    async approveTransaction(transactionId: number, payerId: number) {
        await this.prismaService.transactionHistory.update({
            where: {
                transactionId,
                status: 'PENDING',
                transaction: {
                    payerId
                }
            },
            data: {
                status: 'SUCCESS'
            }
        });
    }
}

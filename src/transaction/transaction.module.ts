import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PrismaModule, WalletModule, UsersModule],
  providers: [TransactionService],
  controllers: [TransactionController]
})
export class TransactionModule {}

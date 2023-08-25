import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { TransactionModule } from './transaction/transaction.module';
import { WalletService } from './wallet/wallet.service';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, TransactionModule, WalletModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, WalletService],
})
export class AppModule {}

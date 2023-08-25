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
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    AuthModule, 
    UsersModule, 
    PrismaModule, 
    TransactionModule, 
    WalletModule,
    MailerModule.forRoot({
      transport: 'smtp://localhost:1025',
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>'
      },
      template: {
        dir: __dirname + "/templates",
        adapter: new HandlebarsAdapter(undefined, {
          inlineCssEnabled: true,
          inlineCssOptions: {
            url: ' ',
            preserveMediaQueries: true,
          }
        }),
        options: {
          strict: true
        }
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, WalletService],
})
export class AppModule {}

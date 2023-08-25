import { BadRequestException, Body, Controller, HttpException, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateTransactionDto } from './create-transaction.dto';
import { IUser } from 'src/users/user.interface';
import { WalletService } from 'src/wallet/wallet.service';

@ApiBearerAuth()
@ApiTags('Transactions')
@Controller('transaction')
export class TransactionController {
    constructor(
        private transactionService: TransactionService,
        private walletService: WalletService
    ) {}

    @Post()
    @UseGuards(AuthGuard)
    async create(@Body() createTransactionDto: CreateTransactionDto, @Request() req) {
        const user: IUser = req["user"];

        if (user.userType == "MERCHANT") {
            throw new UnauthorizedException('Merchant cannot send payment.');
        }
        
        const transactionAmmount = createTransactionDto.ammount;
        const payeeId = createTransactionDto.payeeId;

        await this.transactionService.transfer(transactionAmmount, user.id, payeeId);
    }
}

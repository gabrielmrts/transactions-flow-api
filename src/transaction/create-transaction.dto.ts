import { ApiProperty } from "@nestjs/swagger";

export class CreateTransactionDto {

    @ApiProperty({
        type: Number
    })
    payeeId: number;

    @ApiProperty({
        type: Number
    })
    ammount: number;

}
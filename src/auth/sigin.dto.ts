import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {

    @ApiProperty({
        type: String
    })
    email: string;

    @ApiProperty({
        type: String
    })
    password: string;

}
import { IsString, IsNotEmpty } from 'class-validator';

export class WalletDto {
  @IsString()
  @IsNotEmpty()
  walletAddress: string;
}

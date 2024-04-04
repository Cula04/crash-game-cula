import { ApiProperty } from '@nestjs/swagger';
import { UserInfo } from 'src/common/types';

export class UserInfoOutputDto implements UserInfo {
  @ApiProperty({
    type: String,
    description: 'The id of the user',
  })
  _id: string;

  @ApiProperty({
    type: String,
    description: 'The username of the user',
  })
  userName: string;

  @ApiProperty({
    type: String,
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the user is verified',
  })
  isVerified: boolean;
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiOkOutputResponse } from 'src/common/decorators/swagger/api-ok-output-response.decorator';
import { OutputDto } from 'src/common/dto/output.dto';
import { UserInfoOutputDto } from './dtos/create-user-output.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserBetsOutputDto } from './dtos/user-bets-output.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @ApiOkOutputResponse(UserInfoOutputDto)
  async createUser(
    @Body() body: CreateUserDto,
  ): Promise<OutputDto<UserInfoOutputDto>> {
    const data = await this.userService.createUser(body);
    return { data };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkOutputResponse(UserInfoOutputDto)
  async getUserInfo(
    @Param('id') id: string,
  ): Promise<OutputDto<UserInfoOutputDto>> {
    const data = await this.userService.getUserInfo(id);
    return { data };
  }

  @Get(':id/bets')
  @HttpCode(HttpStatus.OK)
  @ApiOkOutputResponse([UserBetsOutputDto])
  async getUserBets(
    @Param('id') id: string,
  ): Promise<OutputDto<UserBetsOutputDto[]>> {
    const data = await this.userService.getUserBets(id);
    return { data };
  }
}

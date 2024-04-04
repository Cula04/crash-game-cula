import { Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiOkOutputResponse } from 'src/common/decorators/swagger/api-ok-output-response.decorator';
import { OutputDto } from 'src/common/dto/output.dto';
import { GetRoundOutputDto } from './dtos/get-round-output.dto';
import { CrashRoundEventsService } from './services/crash-round-events.service';

@Controller('rounds')
@ApiTags('rounds')
export class CrashRoundController {
  constructor(
    private readonly crashRoundEventsService: CrashRoundEventsService,
  ) {}

  @Post(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkOutputResponse(GetRoundOutputDto)
  async getRoundHistory(
    @Param('id') id: number,
  ): Promise<OutputDto<GetRoundOutputDto>> {
    const data = await this.crashRoundEventsService.getRoundHistory(id);
    return { data };
  }
}

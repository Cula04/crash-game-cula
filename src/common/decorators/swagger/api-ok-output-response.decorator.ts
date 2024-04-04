import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { OutputDto } from '../../dto/output.dto';

export const ApiOkOutputResponse = <TModel extends Type<any>>(
  model: TModel | TModel[],
  options?: Omit<ApiResponseOptions, 'schema'>,
) => {
  const isArray = Array.isArray(model);
  const singleModel = isArray ? model[0] : model;
  return applyDecorators(
    ApiExtraModels(singleModel),
    ApiOkResponse({
      schema: {
        title: `OutputOf${singleModel.name}`,
        allOf: [
          { $ref: getSchemaPath(OutputDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(singleModel) },
            },
          },
        ],
      },
      isArray,
      ...(options ?? {}),
    }),
  );
};

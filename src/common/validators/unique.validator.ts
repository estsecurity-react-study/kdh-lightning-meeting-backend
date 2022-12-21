import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { DataSource } from 'typeorm';

type ValidationEntity =
  | {
      id?: number | string;
    }
  | undefined;

@Injectable()
@ValidatorConstraint({ name: 'Unique', async: true })
export class UniqueValidator implements ValidatorConstraintInterface {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async validate(value: string, validationArguments: ValidationArguments) {
    // 빈 문자열은 혹은 null값을 체크하지 않기 위함
    if (!value || value === '') {
      return true;
    }

    const repository = validationArguments.constraints[0] as string;
    const currentValue = validationArguments.object as ValidationEntity;
    const entity = (await this.dataSource.getRepository(repository).findOne({
      where: {
        [validationArguments.property]: value,
      },
    })) as ValidationEntity;

    if (entity?.id === currentValue?.id) {
      return true;
    }

    return !entity;
  }
}

import { validateOrReject } from 'class-validator';
import { BeforeInsert, BeforeUpdate } from 'typeorm';

import { BaseEntity } from './base.entity';

export class ValidateEntity extends BaseEntity {
  @BeforeInsert()
  @BeforeUpdate()
  async validate(): Promise<void> {
    await validateOrReject(this, { skipMissingProperties: true });
  }
}

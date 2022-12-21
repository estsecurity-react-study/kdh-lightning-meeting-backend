import { InternalServerErrorException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { genSalt, compare, hash } from 'bcryptjs';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsEmail, Length, MaxLength } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

import { AuthProvidersEnum } from 'src/auth/enums/auth-providers.enum';
import { ValidateEntity } from 'src/common/entities/validate.entity';

@Entity()
export class User extends ValidateEntity {
  @ApiProperty({ example: 'test@example.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsEmail(
    {},
    {
      message: '이메일 형식이 아닙니다',
    },
  )
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: '홍길동' })
  @Transform(({ value }) => value?.trim())
  @MaxLength(10, { message: '이름은 10자까지 입력이 가능합니다' })
  @Column({ length: 10 })
  name: string;

  @ApiProperty({ example: 'test1234' })
  @Exclude({ toPlainOnly: true })
  @Transform(({ value }) => value?.trim())
  @Length(8, 24, {
    message: '패스워드는 최소 8자 최대 24자까지 입력이 가능합니다',
  })
  @Column({ nullable: true })
  password: string | null;

  @Expose({ groups: ['me', 'admin'] })
  @Column({
    type: 'enum',
    enum: AuthProvidersEnum,
    default: AuthProvidersEnum.email,
  })
  provider: string;

  @Expose({ groups: ['me', 'admin'] })
  @Column({ nullable: true })
  socialId: string | null;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      try {
        const salt = await genSalt();
        this.password = await hash(this.password, salt);
      } catch {
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(comparePassword: string): Promise<boolean> {
    return await compare(comparePassword, this.password);
  }
}

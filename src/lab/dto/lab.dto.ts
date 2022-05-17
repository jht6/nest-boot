import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PostJsonDto {
  @IsNotEmpty()
  @IsNumber()
  num: number;

  @IsNotEmpty()
  @IsString()
  str: string;
}

// 嵌套对象
export class Paging {
  @IsNotEmpty()
  @IsNumber()
  size: number;

  @IsNotEmpty()
  @IsNumber()
  index: number;
}
export class NestedData {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsObject()
  @ValidateNested({
    each: true,
  })
  paging: Paging;
}

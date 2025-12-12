import { IsString, IsNotEmpty, IsArray, IsIn } from 'class-validator';

export class FilterConditionDto {
  @IsString()
  @IsNotEmpty()
  field: string;

  @IsNotEmpty()
  value: any;

  @IsString()
  @IsIn([
    'equals',
    'ne',
    'gt',
    'gte',
    'lt',
    'lte',
    'in',
    'nin',
    'contains'
  ])
  condition: string;
}

export class FilterGroupDto {
  @IsArray()
  conditions: FilterConditionDto[];

  @IsString()
  @IsIn(['AND', 'OR'])
  groupType: 'AND' | 'OR';
}

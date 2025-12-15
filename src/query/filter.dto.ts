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
    'exists',
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
  @IsIn(['users' , 'vessels' , 'report'])
  db:'users' | 'vessels' | 'report'

  @IsString()
  @IsIn(['LOCAL' , 'Dev' , 'QA'])
  env:'LOCAL' | 'Dev' | 'QA'

  @IsString()
  @IsIn(['AND', 'OR'])
  groupType: 'AND' | 'OR';
}

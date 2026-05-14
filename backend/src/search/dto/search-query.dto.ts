import { IsIn, IsString, MaxLength, MinLength } from 'class-validator';
import { PaginationQueryDto } from '../../shared/dto/pagination.dto';

export class SearchQueryDto extends PaginationQueryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  query: string;

  @IsIn(['users', 'posts'])
  type: 'users' | 'posts';
}

import { StuffCategory } from '../../../types/enums/stuffCategory.enum';

export class CreateBoardResponseDto {
  id: number;
  stuffName: string;
  stuffContent: string;
  stuffPrice: number;
  stuffCategory: StuffCategory;
  creatorId: number;
  imageUrl: string;
  likesCount: number;
}

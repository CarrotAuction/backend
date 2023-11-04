import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from './board.service';
import { Repository } from 'typeorm';
import { BoardMapper } from './mapper/board.mapper';
import { Board } from './entity/board.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>; 
type MockMapper = Partial<Record<keyof BoardMapper, jest.Mock>>;

describe('BoardService', () => {
  let service: BoardService;
  let boardRepository: MockRepository<Board>;
  let boardMapper: MockMapper;

  const mockRepository = () => ({
    save: jest.fn(),
  });

  const mockBoardMapper = {
    DtoToEntity: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        {
          provide: getRepositoryToken(Board),
          useValue: mockRepository(),
        },
        {
          provide: BoardMapper,
          useValue: mockBoardMapper,
        },
      ],
    }).compile();

    service = module.get<BoardService>(BoardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserMapper } from './mapper/user.mapper';
import { EmailAlreadyExistsException } from '../user/userException/EmailAlreadyExistsException';
import { NicknameAlreadyExistsException } from './userException/NicknameAlreadyExistsException';
import { NotFoundUserException } from './userException/NotFoundUserException';
import { LoginInvalidPasswordException } from './userException/LoginInvalidPasswordException';
import { Repository } from 'typeorm';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
})

const mockUserMapper = {
  DtoToEntity: jest.fn(),
}

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

type MockMapper = Partial<Record<keyof UserMapper, jest.Mock>>;

describe('UserService Unit Test', () => {
  let service: UserService;
  let userRepository: MockRepository<User>;
  let userMapper: MockMapper;

  const mockDto = {
    email: 'test@test.com',
    password: 'test',
    nickname: 'test',
    location: 'test',
  };

  const mockLoginDto = {
    nickname: 'test-nickname',
    password: 'test-correctPassword',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository()
        },
        {
          provide: UserMapper,
          useValue: mockUserMapper
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
    userMapper = mockUserMapper;

  });

  afterEach(() => {
    userRepository.findOne.mockClear();
    userRepository.save.mockClear();
    userMapper.DtoToEntity.mockClear();
  });


  it('SUCCESS: 사용자는 회원가입을 한다', async () => {

    const mockUserEntity = Object.assign(new User(), mockDto);

    userRepository.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);


    userMapper.DtoToEntity.mockReturnValue(mockUserEntity);

    userRepository.save.mockResolvedValue(mockUserEntity);

    const result = await service.registerUser(mockDto);
    
    expect(result).toEqual(mockUserEntity);
    expect(userRepository.findOne).toHaveBeenCalledWith({where: {email: mockDto.email}});
    expect(userRepository.findOne).toHaveBeenCalledWith({where: {nickname: mockDto.nickname}});
    expect(userRepository.findOne).toHaveBeenCalledTimes(2);
    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(userRepository.save).toHaveBeenCalledWith(mockUserEntity);
    expect(userMapper.DtoToEntity).toHaveBeenCalledTimes(1);
    expect(userMapper.DtoToEntity).toHaveBeenCalledWith(mockDto);
  });


  it('SUCCESS: 사용자가 로그인을 한다', async () => {

    userRepository.findOne
      .mockResolvedValue({ 
        ...new User(), 
        nickname: mockLoginDto.nickname,
        password: mockLoginDto.password
      });

    const result = await service.loginUser(mockLoginDto);
    
    expect(result).toBe(`${mockLoginDto.nickname}님 안녕하세요!`);
  });


  it('ERROR: 회원가입 시 중복된 이메일이 있으면 EmailAlreadyExistsException을 반환', async () => {

    userRepository.findOne
      .mockResolvedValue({
        ...new User(),
        email: mockDto.email
      });

    await expect(service.registerUser(mockDto))
      .rejects.toThrow(EmailAlreadyExistsException);

    expect(userRepository.findOne).toHaveBeenCalledWith({where: {email: mockDto.email}}); 
  });


  it('ERROR: 회원가입 시 중복된 닉네임이 있으면 NicknameAlreadyExistsException을 반환', async () => {

    userRepository.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        ...new User(),
        nickname: mockDto.nickname
      });

    await expect(service.registerUser(mockDto))
      .rejects.toThrow(NicknameAlreadyExistsException);

    expect(userRepository.findOne).toHaveBeenCalledWith({where: {nickname: mockDto.nickname}});
  });


  it('ERROR: 로그인 시 사용자가 없으면 NotFoundUserException을 반환', async () => {

    userRepository.findOne
      .mockResolvedValue(null);

    await expect(service.loginUser(mockLoginDto))
      .rejects.toThrow(NotFoundUserException);
  });


  it('ERROR: 로그인 시 비밀번호가 일치하지 않으면 LoginInvalidPasswordException을 반환', async () => {

    userRepository.findOne
      .mockResolvedValue({
        ...new User(),
        password: 'test-wrongPassword'
      });
      
    await expect(service.loginUser(mockLoginDto))
      .rejects.toThrow(LoginInvalidPasswordException);
  });
});

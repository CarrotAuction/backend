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
import { City } from '../location/entity/city.entity';
import { Province } from '../location/entity/province.entity';
import { ProvinceInvalidException } from './userException/ProvinceInvalidException';
import { CityInvalidException } from './userException/CityInvalidException';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
type MockMapper = Partial<Record<keyof UserMapper, jest.Mock>>;

describe('UserService Unit Test', () => {
  let service: UserService;
  let userRepository: MockRepository<User>;
  let provinceRepository: MockRepository<Province>;
  let cityRepository: MockRepository<City>;
  let userMapper: MockMapper;

  const mockDto = {
    email: 'test@test.com',
    password: '12345',
    nickname: '사용자',
    province: '서울특별시',
    city: '강남구',
  };

  const mockQueryBuilder = {
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  }

  const mockUserEntity = Object.assign(new User(), mockDto);

  const mockLoginDto = {
    nickname: 'test-nickname',
    password: 'test-correctPassword',
  }

  const mockProvince = { id: 1, name: mockDto.province };
  const mockCity = { id: 1, name: mockDto.city, province_id: mockProvince.id };

  const mockRepository = () => ({
    findOne: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  });

  const mockUserMapper = {
    DtoToEntity: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Province),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(City),
          useValue: mockRepository(),
        },
        {
          provide: UserMapper,
          useValue: mockUserMapper,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
    provinceRepository = module.get(getRepositoryToken(Province));
    cityRepository = module.get(getRepositoryToken(City));
    userMapper = module.get(UserMapper);
    cityRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('SUCCESS: 사용자는 회원가입을 한다', async () => {

    provinceRepository.findOne.mockResolvedValueOnce(mockProvince);
    mockQueryBuilder.getOne.mockResolvedValue(mockCity);
    userRepository.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    userMapper.DtoToEntity.mockReturnValue(mockUserEntity);
    userRepository.save.mockResolvedValue(mockUserEntity);

    const result = await service.registerUser(mockDto);

    // 결과 값이 같은 지 검증
    expect(result).toEqual(mockUserEntity);

    // province 검증
    expect(provinceRepository.findOne).toHaveBeenCalledWith({ where: { name: mockDto.province } });

    // city QueryBuilder 함수 호출 검증
    expect(cityRepository.createQueryBuilder).toHaveBeenCalled();
    expect(cityRepository.createQueryBuilder().leftJoin).toHaveBeenCalledWith(
      "province", "province", "city.province_id = province.id"
    );
    expect(cityRepository.createQueryBuilder().where).toHaveBeenCalledWith(
      "city.name = :cityName", { cityName: mockDto.city }
    );
    expect(cityRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith(
      "province.id = :provinceId", { provinceId: mockProvince.id }
    );
    expect(cityRepository.createQueryBuilder().getOne).toHaveBeenCalled();

    // userRepository 실행 순서 검증
    expect(userRepository.findOne).toHaveBeenNthCalledWith(1, { where: { email: mockDto.email } });
    expect(userRepository.findOne).toHaveBeenNthCalledWith(2, { where: { nickname: mockDto.nickname } });

    // userRepository 호출 횟수 검증
    expect(userRepository.findOne).toHaveBeenCalledTimes(2);

    // save 호출 횟수, 조건 검증
    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(userRepository.save).toHaveBeenCalledWith(mockUserEntity);

    // DtoToEntity 호출 횟수, 조건 검증
    expect(userMapper.DtoToEntity).toHaveBeenCalledTimes(1);
    expect(userMapper.DtoToEntity).toHaveBeenCalledWith(mockDto, mockProvince, mockCity);

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

  it('ERROR: 회원가입 시 없는 행정구역을 선택하면 ProvinceInvalidException을 반환', async () => {

    provinceRepository.findOne
      .mockResolvedValue(null)

    await expect(service.registerUser(mockDto))
      .rejects.toThrow(ProvinceInvalidException);
    
    expect(provinceRepository.findOne).toHaveBeenCalledWith({where: {name: mockDto.province}});
  });


  it('ERROR: 회원가입 시 없는 행정구역을 선택하면 CityInvalidException을 반환', async () => {

    provinceRepository.findOne
      .mockResolvedValue(mockProvince);

      mockQueryBuilder.getOne.mockResolvedValue(null);

    await expect(service.registerUser(mockDto))
      .rejects.toThrow(CityInvalidException);

  });


  it('ERROR: 회원가입 시 중복된 이메일이 있으면 EmailAlreadyExistsException을 반환', async () => {


    provinceRepository.findOne.mockResolvedValueOnce(mockProvince);
    mockQueryBuilder.getOne.mockResolvedValue(mockCity);

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

    provinceRepository.findOne.mockResolvedValueOnce(mockProvince);
    mockQueryBuilder.getOne.mockResolvedValue(mockCity);

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

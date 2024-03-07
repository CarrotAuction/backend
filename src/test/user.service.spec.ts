// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthService} from '../modules/auth/auth.service';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { User } from '../modules/user/entity/user.entity';
// import { UserMapper } from '../modules/auth/mapper/user.mapper';
// import { NicknameAlreadyExistsException } from '../modules/auth/userException/NicknameAlreadyExistsException';
// import { NotFoundUserException } from '../modules/auth/userException/NotFoundUserException';
// import { LoginInvalidPasswordException } from '../modules/auth/userException/LoginInvalidPasswordException';
// import { Repository } from 'typeorm';
// import { City } from '../modules/location/entity/city.entity';
// import { Province } from '../modules/location/entity/province.entity';
// import { ProvinceInvalidException } from '../modules/auth/userException/ProvinceInvalidException';
// import { CityInvalidException } from '../modules/auth/userException/CityInvalidException';
// import { AccountIdAlreadyExistsException } from '../modules/auth/userException/AccountIdAlreadyExistsException';

// type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
// type MockMapper = Partial<Record<keyof UserMapper, jest.Mock>>;

// describe('UserService Unit Test', () => {
//   let service: AuthService;
//   let userRepository: MockRepository<User>;
//   let provinceRepository: MockRepository<Province>;
//   let cityRepository: MockRepository<City>;
//   let userMapper: MockMapper;

//   const mockDto = {
//     accountID: 'yeye2me',
//     password: '12345',
//     nickname: '사용자',
//     province: '서울특별시',
//     city: '강남구',
//   };

//   const mockQueryBuilder = {
//     leftJoin: jest.fn().mockReturnThis(),
//     where: jest.fn().mockReturnThis(),
//     andWhere: jest.fn().mockReturnThis(),
//     getOne: jest.fn(),
//   }

//   const mockUserEntity = Object.assign(new User(), mockDto);

//   const mockLoginDto = {
//     accountID: 'yeye2me',
//     password: 'test-correctPassword',
//   }

//   const bcrypt = require('bcrypt');
//   bcrypt.compare = jest.fn().mockResolvedValue(true);

//   const mockUser = {
//     ...new User(),
//     accountID: mockLoginDto.accountID,
//     password: mockLoginDto.password,
//     nickname: '테스트',
//   };

//   const mockProvince = { id: 1, name: mockDto.province };
//   const mockCity = { id: 1, name: mockDto.city, province_id: mockProvince.id };

//   const mockRepository = () => ({
//     findOne: jest.fn(),
//     save: jest.fn(),
//     createQueryBuilder: jest.fn(),
//   });

//   const mockUserMapper = {
//     DtoToEntity: jest.fn(),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AuthService,
//         {
//           provide: getRepositoryToken(User),
//           useValue: mockRepository(),
//         },
//         {
//           provide: getRepositoryToken(Province),
//           useValue: mockRepository(),
//         },
//         {
//           provide: getRepositoryToken(City),
//           useValue: mockRepository(),
//         },
//         {
//           provide: UserMapper,
//           useValue: mockUserMapper,
//         },
//       ],
//     }).compile();

//     service = module.get<AuthService>(AuthService);
//     userRepository = module.get(getRepositoryToken(User));
//     provinceRepository = module.get(getRepositoryToken(Province));
//     cityRepository = module.get(getRepositoryToken(City));
//     userMapper = module.get(UserMapper);
//     cityRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('SUCCESS: 사용자는 회원가입을 한다', async () => {

//     provinceRepository.findOne.mockResolvedValueOnce(mockProvince);
//     mockQueryBuilder.getOne.mockResolvedValue(mockCity);
//     userRepository.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
//     userMapper.DtoToEntity.mockReturnValue(mockUserEntity);
//     userRepository.save.mockResolvedValue(mockUserEntity);

//     const result = await service.registerUser(mockDto);

//     // 결과 값이 같은 지 검증
//     expect(result).toEqual(mockUserEntity);

//     // province 검증
//     expect(provinceRepository.findOne).toHaveBeenCalledWith({ where: { name: mockDto.province } });

//     // city QueryBuilder 함수 호출 검증
//     expect(cityRepository.createQueryBuilder).toHaveBeenCalled();
//     expect(cityRepository.createQueryBuilder().leftJoin).toHaveBeenCalledWith(
//       "province", "province", "city.province_id = province.id"
//     );
//     expect(cityRepository.createQueryBuilder().where).toHaveBeenCalledWith(
//       "city.name = :cityName", { cityName: mockDto.city }
//     );
//     expect(cityRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith(
//       "province.id = :provinceId", { provinceId: mockProvince.id }
//     );
//     expect(cityRepository.createQueryBuilder().getOne).toHaveBeenCalled();

//     // userRepository 실행 순서 검증
//     expect(userRepository.findOne).toHaveBeenNthCalledWith(1, { where: { accountID: mockDto.accountID } });
//     expect(userRepository.findOne).toHaveBeenNthCalledWith(2, { where: { nickname: mockDto.nickname } });

//     // userRepository 호출 횟수 검증
//     expect(userRepository.findOne).toHaveBeenCalledTimes(2);

//     // save 호출 횟수, 조건 검증
//     expect(userRepository.save).toHaveBeenCalledTimes(1);
//     expect(userRepository.save).toHaveBeenCalledWith(mockUserEntity);

//     // DtoToEntity 호출 횟수, 조건 검증
//     expect(userMapper.DtoToEntity).toHaveBeenCalledTimes(1);
//     expect(userMapper.DtoToEntity).toHaveBeenCalledWith(mockDto, mockProvince, mockCity);

//   });


//   it('SUCCESS: 사용자가 로그인을 한다', async () => {

//     userRepository.findOne.mockResolvedValue(mockUser);
    

//     const result = await service.loginUser(mockLoginDto);
    
//     expect(result.message).toBe(`${mockUser.nickname}님 안녕하세요!`);
//   });

//   it('ERROR: 회원가입 시 없는 행정구역을 선택하면 ProvinceInvalidException을 반환', async () => {

//     provinceRepository.findOne
//       .mockResolvedValue(null)

//     await expect(service.registerUser(mockDto))
//       .rejects.toThrow(ProvinceInvalidException);
    
//     expect(provinceRepository.findOne).toHaveBeenCalledWith({where: {name: mockDto.province}});
//   });


//   it('ERROR: 회원가입 시 없는 행정구역을 선택하면 CityInvalidException을 반환', async () => {

//     provinceRepository.findOne
//       .mockResolvedValue(mockProvince);

//       mockQueryBuilder.getOne.mockResolvedValue(null);

//     await expect(service.registerUser(mockDto))
//       .rejects.toThrow(CityInvalidException);

//   });


//   it('ERROR: 회원가입 시 중복된 이메일이 있으면 AccountIdAlreadyExistsException을 반환', async () => {


//     provinceRepository.findOne.mockResolvedValueOnce(mockProvince);
//     mockQueryBuilder.getOne.mockResolvedValue(mockCity);

//     userRepository.findOne
//       .mockResolvedValue({
//         ...new User(),
//         accountID: mockDto.accountID
//       });

//     await expect(service.registerUser(mockDto))
//       .rejects.toThrow(AccountIdAlreadyExistsException);

//     expect(userRepository.findOne).toHaveBeenCalledWith({where: {accountID: mockDto.accountID}}); 
//   });


//   it('ERROR: 회원가입 시 중복된 닉네임이 있으면 NicknameAlreadyExistsException을 반환', async () => {

//     provinceRepository.findOne.mockResolvedValueOnce(mockProvince);
//     mockQueryBuilder.getOne.mockResolvedValue(mockCity);

//     userRepository.findOne
//       .mockResolvedValueOnce(null)
//       .mockResolvedValueOnce({
//         ...new User(),
//         nickname: mockDto.nickname
//       });

//     await expect(service.registerUser(mockDto))
//       .rejects.toThrow(NicknameAlreadyExistsException);

//     expect(userRepository.findOne).toHaveBeenCalledWith({where: {nickname: mockDto.nickname}});
//   });


//   it('ERROR: 로그인 시 사용자가 없으면 NotFoundUserException을 반환', async () => {

//     userRepository.findOne
//       .mockResolvedValue(null);

//     await expect(service.loginUser(mockLoginDto))
//       .rejects.toThrow(NotFoundUserException);
//   });


//   it('ERROR: 로그인 시 비밀번호가 일치하지 않으면 LoginInvalidPasswordException을 반환', async () => {

//     userRepository.findOne
//       .mockResolvedValue({
//         ...new User(),
//         password: 'test-wrongPassword'
//       });

//       bcrypt.compare.mockResolvedValue(false);
      
//     await expect(service.loginUser(mockLoginDto))
//       .rejects.toThrow(LoginInvalidPasswordException);
//   });
// });

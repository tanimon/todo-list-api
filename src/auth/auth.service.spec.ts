import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a user ID', () => {
    const token =
      'eyJraWQiOiJtYjVjbXdOZTZNa25MQnhDSHh0am0xWTVCS1dZOW5RdTgwUEhGbXJtbHB3PSIsImFsZyI6IlJTMjU2In0.eyJvcmlnaW5fanRpIjoiZjY5N2VlZjMtN2RkZS00YjEzLTg4YzAtYTc0NjBkOGE1MjYxIiwic3ViIjoiYjY5MzRiZDktZDViYy00ZTBjLTk0NDQtNzdjMDJiZGUwM2MyIiwiYXVkIjoiM290Nm50bG04Z3Zxa2o4NGRlZjI5Z2oydnIiLCJldmVudF9pZCI6ImFiNTk3MTQ4LWI4ZDktNGNjOC05YTU3LTAyMzUxNDc1ODYwZCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjM1OTk3NjYxLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtbm9ydGhlYXN0LTEuYW1hem9uYXdzLmNvbVwvYXAtbm9ydGhlYXN0LTFfSHdOSmxzd3RhIiwiY29nbml0bzp1c2VybmFtZSI6InRlc3QiLCJleHAiOjE2MzYwMDEyNjEsImlhdCI6MTYzNTk5NzY2MSwianRpIjoiYWQyN2QzM2MtODNiZi00OTc4LWJiM2EtMWVjMWNlYjg5N2E2In0.Yv9BxgbrRR2bCvik_kKOI1da2cTpN8HyA0Zb7hir6myATwVxFbK3uEKGQDG2psPGu-H4Wqru2NlNVwsafXESl_rdkWvAfputmKBs1nC19iuQHLq_4z92hZfvcYB7zlIWXdN2cMnmeFDs8MeJfyv1UHtWtI1sE0AtC1lh6uIhnm4AKFvZZm8CjTLyfhT6INOyrijyM2Z901rvMghW2nsHvajACDH1vm4Gd5i4-kHvM9HBVKeDt_U3wugleXTWpVtScTHPIDhhs7Etta-oiONZj_aURmRfuEqpJMUJwfxYa7FFL4E_PZZ9J8Kivv3f2hEHpG9gQdnjokmBJhkG0isFVA';

    const actualUserId = service.getCurrentUserId(token);

    const expectedUserId = 'b6934bd9-d5bc-4e0c-9444-77c02bde03c2';
    expect(actualUserId).toBe(expectedUserId);
  });
});

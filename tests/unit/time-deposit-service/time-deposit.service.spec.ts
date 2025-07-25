import { Test, TestingModule } from '@nestjs/testing';
import { TimeDepositService } from '../../../src/modules/time-deposits/application/services/time-deposit.service';
import { TIME_DEPOSIT_REPOSITORY } from '../../../src/modules/time-deposits/domain/repositories/time-deposit.repository.interface';
import { Deposit } from '../../../src/modules/time-deposits/domain/models/deposit.model';
import { Decimal } from 'decimal.js';

describe('TimeDepositService', () => {
  let service: TimeDepositService;
  let mockTimeDepositRepository;

  const mockDeposits = [
    new Deposit(1, 'basic', new Decimal(1000), 30, []),
    new Deposit(2, 'premium', new Decimal(2000), 60, []),
  ];

  beforeEach(async () => {
    // Create a mock repository with all the required methods
    mockTimeDepositRepository = {
      findAll: jest.fn().mockResolvedValue(mockDeposits),
      findById: jest.fn().mockImplementation((id) => {
        const deposit = mockDeposits.find(d => d.id === id);
        return Promise.resolve(deposit || null);
      }),
      updateAll: jest.fn().mockResolvedValue(mockDeposits),
      save: jest.fn(),
      saveMany: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimeDepositService,
        {
          provide: TIME_DEPOSIT_REPOSITORY,
          useValue: mockTimeDepositRepository,
        },
      ],
    }).compile();

    service = module.get<TimeDepositService>(TimeDepositService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all deposits', async () => {
      const deposits = await service.findAll();
      expect(deposits).toEqual(mockDeposits);
      expect(mockTimeDepositRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a deposit by id if found', async () => {
      const deposit = await service.findById(1);
      expect(deposit).toEqual(mockDeposits[0]);
      expect(mockTimeDepositRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should return null if deposit is not found', async () => {
      mockTimeDepositRepository.findById.mockResolvedValueOnce(null);
      const deposit = await service.findById(999);
      expect(deposit).toBeNull();
      expect(mockTimeDepositRepository.findById).toHaveBeenCalledWith(999);
    });
  });

  describe('updateAllBalances', () => {
    it('should update all deposit balances', async () => {
      const updatedDeposits = await service.updateAllBalances();
      expect(updatedDeposits).toEqual(mockDeposits);
      expect(mockTimeDepositRepository.updateAll).toHaveBeenCalled();
    });
  });
});

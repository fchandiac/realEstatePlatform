import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsService } from './analytics.service';
import { Property } from '../../entities/property.entity';
import { Contract } from '../../entities/contract.entity';
import { User, UserRole } from '../../entities/user.entity';
import { PropertyStatus } from '../../common/enums/property-status.enum';
import { ContractStatus, ContractOperationType } from '../../entities/contract.entity';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let propertyRepository: Repository<Property>;
  let contractRepository: Repository<Contract>;
  let userRepository: Repository<User>;

  const mockPropertyRepository = {
    createQueryBuilder: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    getCount: jest.fn(),
    getRawOne: jest.fn(),
    getRawMany: jest.fn(),
  };

  const mockContractRepository = {
    createQueryBuilder: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    getCount: jest.fn(),
    getRawOne: jest.fn(),
    getRawMany: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getRepositoryToken(Property),
          useValue: mockPropertyRepository,
        },
        {
          provide: getRepositoryToken(Contract),
          useValue: mockContractRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    propertyRepository = module.get<Repository<Property>>(getRepositoryToken(Property));
    contractRepository = module.get<Repository<Contract>>(getRepositoryToken(Contract));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAgentPerformance', () => {
    it('should return agent performance metrics', async () => {
      const mockAgent = {
        id: 'agent-1',
        name: 'John Doe',
        role: UserRole.AGENT,
      };

      mockUserRepository.findOne.mockResolvedValue(mockAgent);
      mockPropertyRepository.getCount.mockResolvedValue(10);
      mockContractRepository.getCount.mockResolvedValue(3);
      mockContractRepository.getRawOne.mockResolvedValue({ total: 150000 });
      mockPropertyRepository.getRawMany.mockResolvedValue([
        { status: 'PUBLISHED', count: '5' },
        { status: 'SOLD', count: '2' },
      ]);
      mockContractRepository.getRawMany.mockResolvedValue([
        { operation: 'COMPRAVENTA', count: '2' },
        { operation: 'ARRIENDO', count: '1' },
      ]);

      const result = await service.getAgentPerformance('agent-1');

      expect(result).toBeDefined();
      expect(result.agentId).toBe('agent-1');
      expect(result.agentName).toBe('John Doe');
      expect(result.metrics.assignedProperties).toBe(10);
      expect(result.metrics.closedContracts).toBe(3);
      expect(result.metrics.conversionRate).toBe(30);
    });

    it('should throw error if agent not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.getAgentPerformance('invalid-agent')).rejects.toThrow(
        'Agent with ID invalid-agent not found'
      );
    });
  });
});
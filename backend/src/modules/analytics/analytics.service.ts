import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, SelectQueryBuilder } from 'typeorm';
import { Property } from '../../entities/property.entity';
import { Contract } from '../../entities/contract.entity';
import { User, UserRole } from '../../entities/user.entity';
import { PropertyStatus } from '../../common/enums/property-status.enum';
import { ContractStatus, ContractOperationType } from '../../entities/contract.entity';
import { AgentPerformance, AgentPerformanceMetrics, AnalyticsFilters, GeographicAnalytics } from './interfaces/agent-performance.interface';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAgentPerformance(
    agentId: string,
    filters: AnalyticsFilters = {}
  ): Promise<AgentPerformance> {
    const agent = await this.userRepository.findOne({
      where: { id: agentId, role: UserRole.AGENT },
    });

    if (!agent) {
      throw new Error(`Agent with ID ${agentId} not found`);
    }

    const metrics = await this.calculateAgentMetrics(agentId, filters);
    const period = this.getPeriodString(filters);

    return {
      agentId,
      agentName: agent.name,
      period,
      metrics,
    };
  }

  async getAllAgentsPerformance(
    filters: AnalyticsFilters = {}
  ): Promise<AgentPerformance[]> {
    const agents = await this.userRepository.find({
      where: { role: UserRole.AGENT },
    });

    const performances: AgentPerformance[] = [];
    const period = this.getPeriodString(filters);

    for (const agent of agents) {
      try {
        const metrics = await this.calculateAgentMetrics(agent.id, filters);
        performances.push({
          agentId: agent.id,
          agentName: agent.name,
          period,
          metrics,
        });
      } catch (error) {
        this.logger.error(`Error calculating metrics for agent ${agent.id}:`, error);
      }
    }

    return performances;
  }

  private async calculateAgentMetrics(
    agentId: string,
    filters: AnalyticsFilters
  ): Promise<AgentPerformanceMetrics> {
    const dateRange = this.getDateRange(filters);

    // Get assigned properties count
    const assignedProperties = await this.getAssignedPropertiesCount(agentId, dateRange);

    // Get closed contracts count
    const closedContracts = await this.getClosedContractsCount(agentId, dateRange, filters.operationType);

    // Calculate conversion rate
    const conversionRate = assignedProperties > 0 ? (closedContracts / assignedProperties) * 100 : 0;

    // Get total contract value
    const totalContractValue = await this.getTotalContractValue(agentId, dateRange, filters.operationType);

    // Get average closure days
    const avgClosureDays = await this.getAverageClosureDays(agentId, dateRange, filters.operationType);

    // Get properties by status
    const propertiesByStatus = await this.getPropertiesByStatus(agentId, dateRange);

    // Get contracts by operation
    const contractsByOperation = await this.getContractsByOperation(agentId, dateRange);

    return {
      assignedProperties,
      closedContracts,
      conversionRate: Math.round(conversionRate * 100) / 100, // Round to 2 decimal places
      totalContractValue,
      avgClosureDays: Math.round(avgClosureDays * 100) / 100, // Round to 2 decimal places
      propertiesByStatus,
      contractsByOperation,
    };
  }

  private async getAssignedPropertiesCount(
    agentId: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<number> {
    const query = this.propertyRepository
      .createQueryBuilder('property')
      .where('property.assignedAgentId = :agentId', { agentId })
      .andWhere('property.deletedAt IS NULL');

    if (dateRange) {
      query.andWhere('property.createdAt BETWEEN :start AND :end', {
        start: dateRange.start,
        end: dateRange.end,
      });
    }

    return await query.getCount();
  }

  private async getClosedContractsCount(
    agentId: string,
    dateRange?: { start: Date; end: Date },
    operationType?: 'SALE' | 'RENT'
  ): Promise<number> {
    const query = this.contractRepository
      .createQueryBuilder('contract')
      .innerJoin('contract.property', 'property')
      .where('property.assignedAgentId = :agentId', { agentId })
      .andWhere('contract.status = :status', { status: ContractStatus.CLOSED })
      .andWhere('contract.deletedAt IS NULL')
      .andWhere('property.deletedAt IS NULL');

    if (dateRange) {
      query.andWhere('contract.createdAt BETWEEN :start AND :end', {
        start: dateRange.start,
        end: dateRange.end,
      });
    }

    if (operationType) {
      const contractOp = operationType === 'SALE' ? ContractOperationType.COMPRAVENTA : ContractOperationType.ARRIENDO;
      query.andWhere('contract.operation = :operation', { operation: contractOp });
    }

    return await query.getCount();
  }

  private async getTotalContractValue(
    agentId: string,
    dateRange?: { start: Date; end: Date },
    operationType?: 'SALE' | 'RENT'
  ): Promise<number> {
    const query = this.contractRepository
      .createQueryBuilder('contract')
      .innerJoin('contract.property', 'property')
      .select('SUM(contract.amount)', 'total')
      .where('property.assignedAgentId = :agentId', { agentId })
      .andWhere('contract.status = :status', { status: ContractStatus.CLOSED })
      .andWhere('contract.deletedAt IS NULL')
      .andWhere('property.deletedAt IS NULL');

    if (dateRange) {
      query.andWhere('contract.createdAt BETWEEN :start AND :end', {
        start: dateRange.start,
        end: dateRange.end,
      });
    }

    if (operationType) {
      const contractOp = operationType === 'SALE' ? ContractOperationType.COMPRAVENTA : ContractOperationType.ARRIENDO;
      query.andWhere('contract.operation = :operation', { operation: contractOp });
    }

    const result = await query.getRawOne();
    return result?.total || 0;
  }

  private async getAverageClosureDays(
    agentId: string,
    dateRange?: { start: Date; end: Date },
    operationType?: 'SALE' | 'RENT'
  ): Promise<number> {
    const query = this.contractRepository
      .createQueryBuilder('contract')
      .innerJoin('contract.property', 'property')
      .select([
        'AVG(DATEDIFF(contract.updatedAt, contract.createdAt)) as avgDays'
      ])
      .where('property.assignedAgentId = :agentId', { agentId })
      .andWhere('contract.status = :status', { status: ContractStatus.CLOSED })
      .andWhere('contract.deletedAt IS NULL')
      .andWhere('property.deletedAt IS NULL');

    if (dateRange) {
      query.andWhere('contract.createdAt BETWEEN :start AND :end', {
        start: dateRange.start,
        end: dateRange.end,
      });
    }

    if (operationType) {
      const contractOp = operationType === 'SALE' ? ContractOperationType.COMPRAVENTA : ContractOperationType.ARRIENDO;
      query.andWhere('contract.operation = :operation', { operation: contractOp });
    }

    const result = await query.getRawOne();
    return result?.avgDays || 0;
  }

  private async getPropertiesByStatus(
    agentId: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<{
    REQUEST: number;
    PRE_APPROVED: number;
    PUBLISHED: number;
    INACTIVE: number;
    SOLD: number;
    RENTED: number;
  }> {
    const query = this.propertyRepository
      .createQueryBuilder('property')
      .select('property.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('property.assignedAgentId = :agentId', { agentId })
      .andWhere('property.deletedAt IS NULL')
      .groupBy('property.status');

    if (dateRange) {
      query.andWhere('property.createdAt BETWEEN :start AND :end', {
        start: dateRange.start,
        end: dateRange.end,
      });
    }

    const results = await query.getRawMany();

    const statusCounts = {
      REQUEST: 0,
      PRE_APPROVED: 0,
      PUBLISHED: 0,
      INACTIVE: 0,
      SOLD: 0,
      RENTED: 0,
    };

    results.forEach(result => {
      statusCounts[result.status] = parseInt(result.count, 10);
    });

    return statusCounts;
  }

  private async getContractsByOperation(
    agentId: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<{
    SALE: number;
    RENT: number;
  }> {
    const query = this.contractRepository
      .createQueryBuilder('contract')
      .innerJoin('contract.property', 'property')
      .select('contract.operation', 'operation')
      .addSelect('COUNT(*)', 'count')
      .where('property.assignedAgentId = :agentId', { agentId })
      .andWhere('contract.status = :status', { status: ContractStatus.CLOSED })
      .andWhere('contract.deletedAt IS NULL')
      .andWhere('property.deletedAt IS NULL')
      .groupBy('contract.operation');

    if (dateRange) {
      query.andWhere('contract.createdAt BETWEEN :start AND :end', {
        start: dateRange.start,
        end: dateRange.end,
      });
    }

    const results = await query.getRawMany();

    const operationCounts = {
      SALE: 0,
      RENT: 0,
    };

    results.forEach(result => {
      if (result.operation === ContractOperationType.COMPRAVENTA) {
        operationCounts.SALE = parseInt(result.count, 10);
      } else if (result.operation === ContractOperationType.ARRIENDO) {
        operationCounts.RENT = parseInt(result.count, 10);
      }
    });

    return operationCounts;
  }

  async getGeographicAnalytics(filters: AnalyticsFilters = {}): Promise<GeographicAnalytics> {
    const dateRange = this.getDateRange(filters);
    const period = this.getPeriodString(filters);

    // Get efficiency by region
    const efficiencyByRegion = await this.getEfficiencyByRegion(dateRange, filters.operationType);

    // Get efficiency by commune
    const efficiencyByCommune = await this.getEfficiencyByCommune(dateRange, filters.operationType);

    // Get top and lowest performing regions
    const sortedByConversion = [...efficiencyByRegion].sort((a, b) => b.conversionRate - a.conversionRate);
    const topPerformingRegions = sortedByConversion.slice(0, 5);
    const lowestPerformingRegions = sortedByConversion.slice(-5).reverse();

    return {
      period,
      totalRegions: efficiencyByRegion.length,
      totalCommunes: efficiencyByCommune.length,
      efficiencyByRegion,
      efficiencyByCommune,
      topPerformingRegions,
      lowestPerformingRegions,
    };
  }

  private async getEfficiencyByRegion(
    dateRange?: { start: Date; end: Date },
    operationType?: 'SALE' | 'RENT'
  ): Promise<any[]> {
    const query = this.propertyRepository
      .createQueryBuilder('property')
      .leftJoin('property.state', 'region')
      .leftJoin('property.city', 'commune')
      .select([
        'region.name as region',
        'COUNT(DISTINCT property.id) as assignedProperties',
        'COUNT(DISTINCT CASE WHEN contract.id IS NOT NULL AND contract.status = :contractStatus THEN contract.id END) as closedContracts',
        'AVG(CASE WHEN contract.id IS NOT NULL AND contract.status = :contractStatus THEN DATEDIFF(contract.updatedAt, contract.createdAt) END) as avgClosureDays',
        'SUM(CASE WHEN contract.id IS NOT NULL AND contract.status = :contractStatus THEN contract.amount END) as totalContractValue'
      ])
      .leftJoin('contract', 'contract', 'contract.propertyId = property.id')
      .where('property.deletedAt IS NULL')
      .andWhere('region.name IS NOT NULL')
      .setParameters({ contractStatus: ContractStatus.CLOSED })
      .groupBy('region.name')
      .orderBy('region.name');

    if (dateRange) {
      query.andWhere('property.createdAt BETWEEN :start AND :end', {
        start: dateRange.start,
        end: dateRange.end,
      });
    }

    if (operationType) {
      const contractOp = operationType === 'SALE' ? ContractOperationType.COMPRAVENTA : ContractOperationType.ARRIENDO;
      query.andWhere('contract.operation = :operation', { operation: contractOp });
    }

    const results = await query.getRawMany();

    // Calculate conversion rates and get properties by status for each region
    for (const result of results) {
      const conversionRate = result.assignedProperties > 0 ? (result.closedContracts / result.assignedProperties) * 100 : 0;
      result.conversionRate = Math.round(conversionRate * 100) / 100;
      result.avgClosureDays = result.avgClosureDays || 0;
      result.totalContractValue = result.totalContractValue || 0;

      // Get properties by status for this region
      result.propertiesByStatus = await this.getPropertiesByStatusForLocation(
        { region: result.region },
        dateRange
      );
    }

    return results;
  }

  private async getEfficiencyByCommune(
    dateRange?: { start: Date; end: Date },
    operationType?: 'SALE' | 'RENT'
  ): Promise<any[]> {
    const query = this.propertyRepository
      .createQueryBuilder('property')
      .leftJoin('property.state', 'region')
      .leftJoin('property.city', 'commune')
      .select([
        'region.name as region',
        'commune.name as commune',
        'COUNT(DISTINCT property.id) as assignedProperties',
        'COUNT(DISTINCT CASE WHEN contract.id IS NOT NULL AND contract.status = :contractStatus THEN contract.id END) as closedContracts',
        'AVG(CASE WHEN contract.id IS NOT NULL AND contract.status = :contractStatus THEN DATEDIFF(contract.updatedAt, contract.createdAt) END) as avgClosureDays',
        'SUM(CASE WHEN contract.id IS NOT NULL AND contract.status = :contractStatus THEN contract.amount END) as totalContractValue'
      ])
      .leftJoin('contract', 'contract', 'contract.propertyId = property.id')
      .where('property.deletedAt IS NULL')
      .andWhere('commune.name IS NOT NULL')
      .setParameters({ contractStatus: ContractStatus.CLOSED })
      .groupBy('region.name, commune.name')
      .orderBy('region.name, commune.name');

    if (dateRange) {
      query.andWhere('property.createdAt BETWEEN :start AND :end', {
        start: dateRange.start,
        end: dateRange.end,
      });
    }

    if (operationType) {
      const contractOp = operationType === 'SALE' ? ContractOperationType.COMPRAVENTA : ContractOperationType.ARRIENDO;
      query.andWhere('contract.operation = :operation', { operation: contractOp });
    }

    const results = await query.getRawMany();

    // Calculate conversion rates and get properties by status for each commune
    for (const result of results) {
      const conversionRate = result.assignedProperties > 0 ? (result.closedContracts / result.assignedProperties) * 100 : 0;
      result.conversionRate = Math.round(conversionRate * 100) / 100;
      result.avgClosureDays = result.avgClosureDays || 0;
      result.totalContractValue = result.totalContractValue || 0;

      // Get properties by status for this commune
      result.propertiesByStatus = await this.getPropertiesByStatusForLocation(
        { region: result.region, commune: result.commune },
        dateRange
      );
    }

    return results;
  }

  private async getPropertiesByStatusForLocation(
    location: { region?: string; commune?: string },
    dateRange?: { start: Date; end: Date }
  ): Promise<{
    REQUEST: number;
    PRE_APPROVED: number;
    PUBLISHED: number;
    INACTIVE: number;
    SOLD: number;
    RENTED: number;
  }> {
    const query = this.propertyRepository
      .createQueryBuilder('property')
      .leftJoin('property.state', 'region')
      .leftJoin('property.city', 'commune')
      .select('property.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('property.deletedAt IS NULL');

    if (location.region) {
      query.andWhere('region.name = :region', { region: location.region });
    }
    if (location.commune) {
      query.andWhere('commune.name = :commune', { commune: location.commune });
    }

    if (dateRange) {
      query.andWhere('property.createdAt BETWEEN :start AND :end', {
        start: dateRange.start,
        end: dateRange.end,
      });
    }

    query.groupBy('property.status');

    const results = await query.getRawMany();

    const statusCounts = {
      REQUEST: 0,
      PRE_APPROVED: 0,
      PUBLISHED: 0,
      INACTIVE: 0,
      SOLD: 0,
      RENTED: 0,
    };

    results.forEach(result => {
      statusCounts[result.status] = parseInt(result.count, 10);
    });

    return statusCounts;
  }

  private getDateRange(filters: AnalyticsFilters): { start: Date; end: Date } | undefined {
    if (filters.startDate && filters.endDate) {
      return { start: filters.startDate, end: filters.endDate };
    }

    if (filters.period) {
      const now = new Date();
      const start = new Date();

      switch (filters.period) {
        case 'month':
          start.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          start.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          start.setFullYear(now.getFullYear() - 1);
          break;
        case 'all':
          return undefined;
      }

      return { start, end: now };
    }

    return undefined;
  }

  private getPeriodString(filters: AnalyticsFilters): string {
    if (filters.startDate && filters.endDate) {
      return `${filters.startDate.toISOString().split('T')[0]} to ${filters.endDate.toISOString().split('T')[0]}`;
    }

    if (filters.period) {
      return `Last ${filters.period}`;
    }

    return 'All time';
  }
}
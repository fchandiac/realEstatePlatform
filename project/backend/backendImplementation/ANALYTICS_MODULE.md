# Analytics Module Documentation

## Overview

The Analytics Module provides comprehensive performance tracking and reporting capabilities for real estate agents. It calculates key performance indicators (KPIs) based on the relationship between assigned properties and closed contracts, enabling data-driven insights into agent productivity and effectiveness.

## Architecture

### Components

#### 1. AnalyticsService (`analytics.service.ts`)
Core service responsible for calculating agent performance metrics using complex database queries.

#### 2. AnalyticsController (`analytics.controller.ts`)
REST API controller providing endpoints for retrieving performance data with filtering capabilities.

#### 3. AnalyticsModule (`analytics.module.ts`)
NestJS module that encapsulates the analytics functionality and manages dependencies.

#### 4. DTOs and Interfaces
- `AgentPerformanceDto` - Response DTO for agent performance data
- `AnalyticsFiltersDto` - Request DTO for filtering parameters
- `AgentPerformance` interface - TypeScript interface for performance data
- `AgentPerformanceMetrics` interface - Interface for detailed metrics
- `AnalyticsFilters` interface - Interface for filter parameters

## Database Queries

The module uses optimized TypeORM queries to calculate metrics:

### Key Metrics Calculated

1. **Assigned Properties Count**
   - Counts properties assigned to an agent
   - Filters by date range and excludes soft-deleted records

2. **Closed Contracts Count**
   - Counts successfully closed contracts for agent-assigned properties
   - Supports filtering by operation type (SALE/RENT)

3. **Conversion Rate**
   - Calculated as: `(closed contracts / assigned properties) × 100`
   - Rounded to 2 decimal places

4. **Total Contract Value**
   - Sum of all closed contract amounts for agent's properties
   - Supports operation type filtering

5. **Average Closure Days**
   - Average time between contract creation and closure
   - Calculated using DATEDIFF function

6. **Properties by Status**
   - Distribution of assigned properties across all status types
   - Includes: REQUEST, PRE_APPROVED, PUBLISHED, INACTIVE, SOLD, RENTED

7. **Contracts by Operation**
   - Breakdown of closed contracts by operation type
   - SALE (COMPRAVENTA) and RENT (ARRIENDO)

## API Endpoints

### GET /analytics/agents
Retrieves performance metrics for all agents in the system.

**Query Parameters:**
- `period` (optional): 'month' | 'quarter' | 'year' | 'all'
- `startDate` (optional): ISO 8601 date string
- `endDate` (optional): ISO 8601 date string
- `operationType` (optional): 'SALE' | 'RENT'

**Response:**
```json
[
  {
    "agentId": "uuid",
    "agentName": "string",
    "period": "string",
    "metrics": {
      "assignedProperties": 0,
      "closedContracts": 0,
      "conversionRate": 0.00,
      "totalContractValue": 0,
      "avgClosureDays": 0.00,
      "propertiesByStatus": {
        "REQUEST": 0,
        "PRE_APPROVED": 0,
        "PUBLISHED": 0,
        "INACTIVE": 0,
        "SOLD": 0,
        "RENTED": 0
      },
      "contractsByOperation": {
        "SALE": 0,
        "RENT": 0
      }
    }
  }
]
```

### GET /analytics/agents/:agentId
Retrieves detailed performance metrics for a specific agent.

**Path Parameters:**
- `agentId`: UUID of the agent

**Query Parameters:** Same as above

**Response:** Single agent performance object (same structure as above)

## Business Logic

### Date Range Filtering

The module supports flexible date filtering:

- **Period-based**: Last month, quarter, year, or all time
- **Custom range**: Specific start and end dates
- **Default**: All time if no filters provided

### Agent Validation

- Only users with `UserRole.AGENT` can have performance metrics calculated
- Throws error if agent ID is not found or user is not an agent

### Data Aggregation

- All metrics are calculated in real-time from current database state
- Uses efficient SQL aggregation functions (COUNT, SUM, AVG)
- Handles edge cases (division by zero, null values)

## Security & Auditing

### Audit Integration

All analytics requests are automatically audited using the `@Audit` decorator:

- `VIEW_AGENT_PERFORMANCE` - Individual agent metrics access
- `VIEW_ALL_AGENTS_PERFORMANCE` - All agents metrics access

### Access Control

Currently implemented with audit logging. Future enhancements may include:
- Role-based access control (Admin vs Agent permissions)
- JWT authentication guards
- Permission-based filtering

## Performance Considerations

### Query Optimization

- Uses indexed database queries for efficient data retrieval
- Implements proper JOIN operations between Property and Contract tables
- Minimizes data transfer with selective column queries

### Caching Strategy

Currently calculates metrics in real-time. Future enhancements may include:
- Redis caching for frequently accessed metrics
- Scheduled background calculation for complex aggregations
- Cache invalidation on property/contract updates

## Error Handling

### Error Types

1. **Agent Not Found**: When specified agentId doesn't exist or isn't an agent
2. **Database Errors**: Connection issues or query failures
3. **Validation Errors**: Invalid filter parameters

### Error Responses

```json
{
  "statusCode": 404,
  "message": "Agent with ID {agentId} not found",
  "error": "Not Found"
}
```

## Testing

### Unit Tests

- `AnalyticsService` - Core business logic testing
- Mock repositories for isolated testing
- Edge case coverage (zero division, empty results)

### Integration Tests

- Full API endpoint testing
- Database integration verification
- Authentication and authorization testing

## Future Enhancements

### Planned Features

1. **Real-time Dashboards**
   - WebSocket integration for live metrics updates
   - Frontend dashboard components

2. **Advanced Analytics**
   - Trend analysis over time periods
   - Comparative performance reports
   - Predictive analytics for conversion rates

3. **Export Capabilities**
   - PDF/Excel report generation
   - Scheduled email reports

4. **Performance Optimization**
   - Database query optimization
   - Caching layer implementation
   - Background job processing

### API Extensions

1. **Comparative Analytics**
   - Agent vs team performance
   - Regional performance analysis
   - Property type performance breakdown

2. **Custom Metrics**
   - Configurable KPI definitions
   - Custom date range aggregations
   - Weighted performance scoring

## Dependencies

### External Dependencies

- `@nestjs/common` - NestJS core framework
- `@nestjs/typeorm` - TypeORM integration
- `typeorm` - Database ORM
- `@nestjs/swagger` - API documentation

### Internal Dependencies

- `Property` entity - Property data model
- `Contract` entity - Contract data model
- `User` entity - User data model
- `AuditService` - Audit logging service
- `AuditInterceptor` - Request auditing

## Configuration

### Environment Variables

No specific environment variables required. Uses existing database configuration.

### Module Registration

The AnalyticsModule is registered in `app.module.ts`:

```typescript
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    // ... other modules
    AnalyticsModule,
  ],
})
export class AppModule {}
```

## Usage Examples

### Get All Agents Performance

```bash
curl -X GET "http://localhost:3000/analytics/agents" \
  -H "Content-Type: application/json"
```

### Get Agent Performance with Filters

```bash
curl -X GET "http://localhost:3000/analytics/agents/123e4567-e89b-12d3-a456-426614174000?period=month&operationType=SALE" \
  -H "Content-Type: application/json"
```

### Frontend Integration

```typescript
// Server Action Example
'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function getAgentPerformance(agentId: string, filters?: AnalyticsFilters) {
  const session = await getServerSession(authOptions)
  const token = session?.accessToken

  const params = new URLSearchParams()
  if (filters?.period) params.append('period', filters.period)
  if (filters?.operationType) params.append('operationType', filters.operationType)

  const response = await fetch(
    `${process.env.BACKEND_API_URL}/analytics/agents/${agentId}?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )

  return response.json()
}
```

## Monitoring & Maintenance

### Health Checks

- Database connectivity verification
- Query performance monitoring
- Error rate tracking

### Maintenance Tasks

- Regular audit log cleanup
- Database index optimization
- Query performance analysis

### Logging

All analytics operations are logged through the audit system with:
- User identification
- Timestamp tracking
- Operation details
- Success/failure status

## Conclusion

The Analytics Module provides a solid foundation for agent performance tracking with room for future enhancements. It follows the existing codebase patterns and integrates seamlessly with the current architecture while providing valuable business insights.</content>
<parameter name="filePath">/Users/felipe/dev/realEstatePlatform/project/backEnd/backendImplementation/ANALYTICS_MODULE.md
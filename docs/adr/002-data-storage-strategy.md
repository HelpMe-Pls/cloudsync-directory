# ADR 2: Data Storage Strategy

## Context

- Need efficient data storage without excessive complexity
- Must demonstrate enterprise data patterns (caching, optimization)
- Must be compatible with local development environment
- Limited development time requires focusing on high-impact components
- System should demonstrate performance optimizations

## Decision

Use PostgreSQL as primary datastore with Prisma ORM, plus Redis for caching

- **PostgreSQL**: Primary relational database for all entity data
- **Prisma ORM**: Type-safe database access layer
- **Redis**: In-memory cache for frequently accessed data

## Rationale

- **PostgreSQL**: 
  - Offers enterprise features while being lightweight
  - Supports complex relationships needed for directory services
  - Familiar to most enterprise developers
  - Can demonstrate optimization techniques

- **Prisma ORM**:
  - Reduces boilerplate code significantly, accelerating development
  - Provides type safety and schema migrations
  - Popular in modern TypeScript applications
  - Demonstrates modern development practices

- **Redis**:
  - Provides real-world caching capabilities with minimal setup
  - Enables dramatic performance improvements
  - Common component in enterprise architectures
  - Creates opportunities for demonstrating optimization

## Consequences

### Positive
- Reduced complexity and faster development
- Prisma provides type safety and migration tools
- Can demonstrate substantial performance improvements via caching
- Familiar stack to many enterprise teams
- Clear metrics can be generated (cache hit ratio, query performance)

### Negative
- Lose opportunity to demonstrate multi-database architecture
- Less distributed than some cloud-native solutions
- Simpler than what might be used in an actual mega-scale directory service

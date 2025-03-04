# ADR 1: System Architecture

## Context

- Need to build a directory service MVP that demonstrates enterprise-level concepts
- Limited development time (~60 hours total across 2 months)
- Must run on modest local hardware (Intel i5-1035G1, 7.7GB RAM)
- Must generate quantifiable metrics for resume/interview discussions
- Developer can only dedicate approximately 1 hour per day to the project

## Decision

Implement a microservices-lite architecture with four key components:

1. **Core API Service (NestJS + TypeScript)**
   - Implements REST and GraphQL APIs for directory operations
   - Handles authentication and authorization
   - Manages core business logic

2. **Admin Dashboard (React + TailwindCSS)**
   - Provides management interface for users and groups
   - Displays real-time performance metrics
   - Visualizes system health and operations

3. **Data Layer (PostgreSQL + Prisma + Redis)**
   - PostgreSQL as primary datastore
   - Prisma ORM for type-safe database access
   - Redis for high-performance caching

4. **Event System (RabbitMQ)**
   - Handles asynchronous processing
   - Enables event-driven architecture
   - Simulates cross-region operations

## Rationale

- **Microservices-lite**: Provides a balance between demonstrating enterprise architecture without the complexity of a full microservices deployment
- **NestJS**: Offers built-in modularity and enterprise patterns that align with Microsoft's tech stack
- **PostgreSQL + Prisma**: Simplifies database operations while providing enterprise-grade persistence
- **Redis**: Enables caching demonstrations with minimal configuration
- **RabbitMQ**: Allows for showcasing event-driven architecture patterns common in cloud systems
- **Docker Compose**: Enables single-command deployment for interview demonstrations

## Consequences

### Positive
- Achievable scope within the time constraints
- Demonstrates multiple enterprise concepts relevant to the job description
- Showcases performance optimization techniques
- Creates quantifiable metrics for resume

### Negative
- Less distributed than a true enterprise system
- Some cloud features will be simulated rather than implemented
- Limited scale compared to actual enterprise directories

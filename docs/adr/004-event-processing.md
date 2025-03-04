# ADR 4: Event Processing

## Context

- Need to demonstrate event-driven architecture principles
- Must show understanding of distributed systems concepts
- Should handle asynchronous operations efficiently
- Limited development time requires focusing on high-impact components
- System must be able to simulate distributed operations

## Decision

Implement a message queue-based event processing system using RabbitMQ

- **RabbitMQ**: For reliable message delivery
- **Publisher/Subscriber Pattern**: For decoupled components
- **Event Sourcing**: For critical operations
- **Background Processing**: For non-blocking operations

## Rationale

- **RabbitMQ**:
  - Industry-standard message broker
  - Lightweight enough for local development
  - Rich feature set for demonstrating enterprise patterns
  - Supports multiple messaging patterns

- **Event-Driven Architecture**:
  - Common pattern in cloud-native applications
  - Enables simulation of distributed processing
  - Creates opportunities for demonstrating system resilience
  - Aligns with Microsoft's cloud infrastructure practices

- **Background Processing**:
  - Improves perceived performance
  - Demonstrates understanding of non-blocking operations
  - Common requirement in enterprise applications

## Consequences

### Positive
- Demonstrates understanding of event-driven architecture
- Creates opportunity to discuss distributed systems in interviews
- Enables simulation of regional operations
- Improves system resilience and scalability

### Negative
- Adds complexity to the system
- Requires additional infrastructure component
- Local deployment is a simplified version of true cloud event processing

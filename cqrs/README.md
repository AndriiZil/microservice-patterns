* Event Sourcing and Command Query Responsibility Segregation (CQRS) are architectural patterns that are often used 
together to build scalable and maintainable systems. Event Sourcing involves storing all changes to an application's 
state as a sequence of immutable events. CQRS separates the read and write sides of the application, 
allowing for independent scaling and optimization.
In this example, we'll create a simplified Node.js application that uses Kafka for event sourcing and CQRS.

* Command Service (Write Side):
This service handles commands, such as creating and updating items. It publishes events to Kafka.

* Query Service (Read Side):
This service listens to events in Kafka and maintains a read model to serve queries.

* Event Publisher (Write Side):
This service listens to commands, processes them, and publishes events.

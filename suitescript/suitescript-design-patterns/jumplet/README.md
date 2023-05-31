A SuiteScript design pattern for chaining User Events.

User Events do not natively chain together; when a User Event changes a record, no User Events deployed to the changed
record will fire. The limitation is there for good reason as it helps prevent infinite looping of User Events.

However, there are plenty of situations where you *want* to chain your User Events. The Jumplet pattern allows User
Events to chain by injecting a Suitelet in between the records of interest.

This example looks demonstrates how a Sales Order User Event can automatically create an Invoice *and* trigger the
Invoice's User Events.

# Renaming collections

In this application, we have a collection called Sessions. There is a convention in the code that a variable called Sessions refers to a mongodb bound object that can be used to accept the collection (which actually has the name "sessions".

What I want to do is change this collection to be "Bookings", which will also include modifying any occurrence of sessionId to be bookingId.

We'll need a migration function in server/migrations.js

# Tools

In a similar fashion, I want to rename the Tools collection to be Rentals.

In a similar fashion, I want to rename the Courses collection to be Locations.

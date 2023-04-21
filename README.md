# Intercom clone

This is a clone of the intercom or tawk.

It doesn’t have ai integration; rather, a live agent will communicate with a user.


# Feature story


1. A tenant creates an account on the site.
2. The tenant creates a chatbot and is given an API key.
3. The tenant embeds the chatbot on their website using the API key and tenant ID.
4. When a user initiates a chat, the chatbot asks for their email address and creates a new chatroom for the user.
5. The chatbot sends a message to the chatroom notifying the user that a live agent will join the chat shortly.
6. The chatroom service sends a message to a message queue indicating a new chatroom has been created.
7. A live agent joins the chatroom and begins communicating with the user.
8. As messages are sent between the user and the agent, they are stored in the message table in the database and displayed in the chatroom UI.
9. The analytics service periodically pulls data from the database and generates usage reports.


# Technologies


1. Nestjs
2. MongoDB
3. Kafka with Redpanda
4. Tinybird
5. Redis


# System Design


## Networking

 ![](https://res.cloudinary.com/smiley-geek/image/upload/v1682100164/dut1czqya5jtlgwpaeg7.png)


Requests from the chatbot will be handled by nginx.

Nginx handles:


1. Load balancing
2. SSL termination


Nginx will forward the request to the appropriate microservice.


## Load Balancing

 ![](https://res.cloudinary.com/smiley-geek/image/upload/v1682100190/hhx8az70exwrwwpxbeeq.png)


Nginx will handle load balancing between replicas of the microservices based on some appropriate algorithm.


1. Chat servers → Based on server
2. The rest will be round-robin based.


## Microservices



1. Analytics service 
2. Tenant services 
3. Chat Service
4. Email Service


### Tenant Service

This service will allow a new tenant to create an account and profile.

This service will allow tenants to create, update and delete users/ agents.

This service will allow tenants to create, update and delete chatbots.

This service will handle auth and roles.


### Chatbot Service

This service will allow users to create a chatroom using their email and IP address for auth.

Browser info will be stored as metadata.

Chat service will authenticate chatrooms with a jwt added security.


### Analytics Service

This service will handle analytics for the whole system.

Analytics data points:


1. Application live status
2. Tenant chatbots status
3. \
   \

### Email Service

This service will be used to send emails as the primary notifications


# In-depth system design


## Tenant Service

### Tenant

Profile Data Fields


1. Name


User Data Fields


1. password
2. email
3. roles
4. Name
5. refresh token
6. assigning
7. PasswordChangeToken
8. IP addresses
9. \


Roles Data Fields


1. name
2. Id


Chatbot data fields


1. Id
2. APIKEY
3. tenantId


### User story

A tenant will create an account where they’ll set up their name, admin pass, and admin email.

The admin tenant will have all roles and can create new roles.

The admin can add users.

The admin can assign/ deny permissions to users.

The admin can create, delete, and update  chatbots.


A user/ agent can connect to a chatroom.

The user/ agent can mark a chatroom as stale/ blocked.


## Chat Service

User will add their email and name to the chatbot.

The chatbot will create a chatroom, send a welcome email to the user, add the chatroom to a queue for a live agent to join.

The chatroom will add the message to a queue after emitting the message to the recipient.

The chatroom will have Redis caching.

The chatroom will have a 10 min standby mode where a user can continue asking questions and  reconnect in case of network failure.

The chatroom will handle auth via sessions.


Chatroom data fields


1. email
2. name
3. agentName
4. agentEmail
5. agentId
6. createdAt
7. updatedAt
8. message: [{ message, sentAt, read, sender }]
9. \
   \


## Analytics service

The service will provide handle analytics for the system


1. Infra analytics:

Will return the system live status.

A discovery service can check on the availability of the whole infra.


2. Tenant Specific analytics with integrations with tinybird


## Email Service

This service will handle all email notifications.

The service will consume various notifications from a queue.

Can be improved to razor pay design.


\
 ![](https://res.cloudinary.com/smiley-geek/image/upload/v1682100218/dawvf3jqar5lnfbuteez.png)


Queues

Kafka is used for queueing as well as streaming for realtime analytics and communications.


\

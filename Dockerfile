# Use OpenJDK 17 as the base image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy the built JAR file
COPY target/spring-boot-docker.jar application.jar



# Set the entrypoint
#ENTRYPOINT ["java", "-Dspring.profiles.active=docker", "-jar", "application.jar"]
ENTRYPOINT ["java", "-jar", "application.jar"]

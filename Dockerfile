# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

ENV SPRING_PROFILES_ACTIVE=prod

# Forzamos IPv4 y optimizamos RAM al máximo
ENTRYPOINT ["sh", "-c", "java -Xmx256m -Xss512k -XX:+UseSerialGC -Djava.net.preferIPv4Stack=true -Dserver.port=${PORT:-8080} -Dserver.address=0.0.0.0 -jar app.jar"]

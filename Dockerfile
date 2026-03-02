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

# Ajustamos memoria para Render (Free Tier es 512MB)
ENTRYPOINT ["sh", "-c", "java -Xmx384m -Xms128m -Djava.net.preferIPv4Stack=true -Dserver.port=${PORT:-8080} -Dserver.address=0.0.0.0 -jar app.jar"]

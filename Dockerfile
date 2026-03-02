# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Configuración de entorno
ENV SPRING_PROFILES_ACTIVE=prod

# Comando de inicio con debug y optimización de memoria
# Agregamos -Dserver.port=${PORT} para asegurar que Spring use el puerto de Render
ENTRYPOINT ["sh", "-c", "java -Xmx300m -Xss512k -XX:+UseSerialGC -Djava.security.egd=file:/dev/./urandom -Dserver.port=${PORT:-8080} -jar app.jar"]

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

# Configuración de producción
ENV SPRING_PROFILES_ACTIVE=prod
# Render requiere que la app escuche en 0.0.0.0
ENV SERVER_ADDRESS=0.0.0.0

# Optimización de memoria
ENV JAVA_OPTS="-Xmx300m -Xss512k -XX:+UseSerialGC"

EXPOSE 8080

# Iniciar con el puerto dinámico de Render
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8080} -Dserver.address=0.0.0.0 -jar app.jar"]

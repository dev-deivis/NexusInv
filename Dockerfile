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

# Configuración de Producción
ENV SPRING_PROFILES_ACTIVE=prod
# Optimización de memoria
ENV JAVA_OPTS="-Xmx300m -Xss256k -XX:+UseSerialGC"

# Exponer el puerto
EXPOSE 8080

# Comando de inicio limpio
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

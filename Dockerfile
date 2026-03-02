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

# Optimización extrema para la capa gratuita de Render (512MB)
# -XX:+UseSerialGC: Consume mucho menos RAM que el recolector por defecto
# -Xss256k: Reduce el espacio de memoria por cada hilo de ejecución
ENV JAVA_OPTS="-Xmx300m -Xss256k -XX:+UseSerialGC"

# Render asigna dinámicamente un puerto mediante la variable PORT
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar app.jar"]

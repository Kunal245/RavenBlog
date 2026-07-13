FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml ./
RUN mvn --batch-mode dependency:go-offline

COPY src ./src
RUN mvn --batch-mode package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/target/spring-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "exec java -Dserver.port=${PORT:-8080} -jar /app/app.jar"]

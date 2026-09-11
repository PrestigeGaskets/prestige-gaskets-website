FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /src
COPY server/pom.xml .
COPY server/src ./src
COPY gui-demo/index.html ./src/main/resources/static/index.html
COPY gui-demo/styles.css ./src/main/resources/static/styles.css
COPY gui-demo/app.js ./src/main/resources/static/app.js
COPY gui-demo/workforce-server.js ./src/main/resources/static/workforce-server.js
COPY gui-demo/api-client.js ./src/main/resources/static/api-client.js
RUN mvn -q -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /src/target/rushmore-server-*.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

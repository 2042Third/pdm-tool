# Start with a base image containing Java runtime
FROM openjdk:11-jdk-slim as build

# The student's working directory
WORKDIR /app

# Add the build.py script and source code to the image
COPY build.py ./
COPY src ./src

# Install python3 and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip3 install --no-cache-dir -r requirements.txt

# Run the build.py script
RUN python3 build.py

# Now, start a new stage and copy over the built .war file
FROM tomcat:10

# Copy the war file from the build stage
COPY --from=build /app/app.war /usr/local/tomcat/webapps/

# Expose port 8080 for the Tomcat server
EXPOSE 8080

# Start the Tomcat server
CMD ["catalina.sh", "run"]

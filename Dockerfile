# Use the official Tomcat 10 image from Docker Hub
FROM tomcat:10

# Copy your WAR file to the Tomcat webapps directory
COPY ./web_notes.war /usr/local/tomcat/webapps/web_notes.war

# Expose port 8080 for your Tomcat server
EXPOSE 8080

# Start the Tomcat server
CMD ["catalina.sh", "run"]

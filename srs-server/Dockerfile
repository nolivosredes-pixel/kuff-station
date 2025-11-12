# SRS (Simple Realtime Server) for KUFF DJ Streaming
FROM ossrs/srs:5

# Expose ports
EXPOSE 1935 8080 1985 8000

# Copy custom config
COPY srs.conf /usr/local/srs/conf/srs.conf

# Start SRS
CMD ["/usr/local/srs/objs/srs", "-c", "/usr/local/srs/conf/srs.conf"]

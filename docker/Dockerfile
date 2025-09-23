FROM python:3.11-slim as build
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY server/ ./server/
COPY client/ ./client/

# Runtime stage
FROM python:3.11-slim
WORKDIR /app
RUN useradd -ms /bin/bash appuser
USER appuser
COPY --from=build /usr/local /usr/local
COPY --from=build /app /app
EXPOSE 8080
CMD ["python", "server/app.py"]

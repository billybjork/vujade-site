# Stage 1: Build React Frontend
# Use the Node version specified in your package.json engines or a recent LTS
FROM node:16 as builder
WORKDIR /app
# Copy package files and install dependencies
COPY package.json package-lock.json ./
# Use npm ci for consistency with your logs, ensures lock file usage
RUN npm ci
# Copy the rest of the application code
COPY . .
# Run the build script (ensure CI=false if needed, based on previous linting issues)
# If you fixed the lint errors, you can remove CI=false
RUN npm run build

# Stage 2: Setup Python Backend
# Use the Python version specified in your runtime.txt
FROM python:3.11.5-slim
WORKDIR /app

# Set environment variables for Python
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install OS-level dependencies if any (e.g., for psycopg2 if not using -binary)
# RUN apt-get update && apt-get install -y --no-install-recommends gcc python3-dev libpq-dev && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
# Copy requirements first to leverage Docker layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir --verbose -r requirements.txt

# Copy built frontend from the builder stage
COPY --from=builder /app/build ./build

# Copy backend code (adjust if your api.py is not in the root)
COPY api.py .
# Add any other backend files/folders needed
# e.g., COPY migrations/ ./migrations/
# e.g., COPY models/ ./models/

# Expose the port Gunicorn will run on (Railway injects $PORT)
# This is mostly documentation; Railway handles the actual port mapping.
EXPOSE 8080

# Define the command to run the application using Gunicorn
# Railway will inject the correct $PORT environment variable.
# Use python -m gunicorn for robustness
CMD ["python", "-m", "gunicorn", "api:app", "--bind", "0.0.0.0:$PORT"]
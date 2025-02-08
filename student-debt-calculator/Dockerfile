# Build frontend
FROM node:18 AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Build backend
FROM python:3.11-slim
WORKDIR /app

# Copy backend requirements
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code and data
COPY backend/app ./app
COPY backend/data ./data

# Copy built frontend
COPY --from=frontend-builder /app/dist ./static

# Set environment variables
ENV PYTHONPATH=/app
ENV PORT=8000

# Expose port
EXPOSE 8000

# Start command
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

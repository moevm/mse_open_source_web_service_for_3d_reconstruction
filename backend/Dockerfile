FROM python:3.10

# Set work directory
WORKDIR /app

# Set environment variables
# Don't generate .pyc files
ENV PYTHONDONTWRITEBYTECODE=1
# Don't bufferize an output
ENV PYTHONUNBUFFERED=1

# Install dependencies
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install -r requirements.txt
RUN apt update && apt install -y netcat

# Copy the ENTRYPOINT's script
COPY entrypoint.sh .

# Copy the project
COPY . .

# Run shell script
ENTRYPOINT ["/app/entrypoint.sh"]
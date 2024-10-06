# Start from the official Python base image.
FROM python:3.12-slim

WORKDIR /house_backend

# Augmenting the default search path for custom module files
ENV PYTHONPATH "${PYTHONPATH}:/house_backend:/"

# Installing dependencies
# RUN apt-get update && apt-get install -y vim

RUN pip install --upgrade pip

COPY house_backend/requirements.txt requirements.txt

# Install the package dependencies in the requirements file.
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Set entrypoint for the uvicorn server.
# For certificates' flags, see https://www.uvicorn.org/settings/#https
CMD ["uvicorn", "main:app", \
    "--host", "0.0.0.0", \
    "--port", "443", \
    "--access-log", \
    "--proxy-headers", \
    "--forwarded-allow-ips", "'*'", \
    "--reload"]
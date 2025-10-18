# Backend Dockerfile
FROM python:3.11-slim

# set work directory
WORKDIR /app

# install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy project files
COPY . .

# expose port
EXPOSE 8000

# run server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
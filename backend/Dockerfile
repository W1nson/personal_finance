FROM python:3.11.10-alpine3.20


RUN mkdir -p /app
WORKDIR /app

COPY . .
RUN pip3 install -r requirements.txt 

EXPOSE 8000

CMD ["fastapi", "run", "run.py"]

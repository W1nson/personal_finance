FROM python:3.11.10-alpine3.20


RUN mkdir -p /app
WORKDIR /app

COPY . .
RUN pip3 install -r requirements.txt 

EXPOSE 3000

CMD ["python3", "run.py"]

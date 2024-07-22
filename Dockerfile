FROM python:3.9-alpine

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN apk add --no-cache postgresql-libs && apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev
RUN pip install --no-cache-dir -r requirements.txt
RUN apk --purge del .build-deps

COPY . .

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]
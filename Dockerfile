FROM python:3.10-slim

ENV PIP_DISABLE_PIP_VERSION_CHECK=on

RUN pip install poetry

WORKDIR /app
COPY ./pyproject.toml /app/

RUN poetry config virtualenvs.create false && poetry install --no-dev --no-interaction

COPY ./ /app
WORKDIR /app/src
EXPOSE 8080

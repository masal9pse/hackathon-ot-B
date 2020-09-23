# ローカル環境用
FROM alpine:latest
RUN apk add --no-cache nodejs npm bash

WORKDIR /app

COPY . /app

RUN npm install && npm run db-create

EXPOSE 3000

ENTRYPOINT ["npm"]

CMD ["start"]

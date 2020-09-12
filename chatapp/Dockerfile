FROM alpine:latest
RUN apk add --no-cache nodejs npm


WORKDIR /app


COPY . /app


RUN npm install && npm run db-create


EXPOSE 3000


ENTRYPOINT ["node"]

CMD ["./bin/www"]

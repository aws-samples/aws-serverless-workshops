FROM ruby:2.3-alpine

RUN apk --no-cache add make gcc libc-dev libffi-dev

ADD https://github.com/jgm/pandoc/releases/download/2.1/pandoc-2.1-linux.tar.gz /tmp

WORKDIR /tmp

RUN tar -zxvf pandoc-2.1-linux.tar.gz && \
  mv pandoc-2.1/bin/pandoc /usr/local/bin && \
  rm -rf pandoc-2.1

COPY Gemfile Gemfile.lock /tmp/

RUN bundle

VOLUME /guide

WORKDIR /guide

CMD ["rake", "listen"]

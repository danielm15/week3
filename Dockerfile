FROM node
WORKDIR /server
RUN apt-get update
RUN apt-get install telnet
RUN apt-get install -y sudo
RUN rm -rf /var/lib/apt/lists/*
RUN sudo -su jenkins
RUN echo "jenkins ALL=NOPASSWD: ALL" >> /etc/sudoers
COPY package.json .
RUN npm install --silent
COPY . .
EXPOSE 8080
ENV NODE_PATH /server/
CMD ["./runserver.sh"]

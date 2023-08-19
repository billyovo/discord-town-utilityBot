FROM node:18
ENV NODE_ENV=production

COPY ["package.json", "package-lock.json*", "./"]

RUN apt-get update && apt-get install -y bash curl && curl -1sLf \
'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.deb.sh' | bash \
&& apt-get update && apt-get install -y infisical

RUN npm install
COPY . .
CMD ["infisical", "run", "--env=prod", "--","npm", "start"]
FROM dcr.ziprealty.com/zaplabs/containers/node-service:v3

# Pass in the token at build time so we don't have to update the code or Docker images if the token changes
ARG NPM_TOKEN_ARG
ENV NPM_TOKEN=$NPM_TOKEN_ARG

COPY --chown=zaplabs:zaplabs src /opt/node/app/src
COPY --chown=zaplabs:zaplabs dist /opt/node/app/dist

COPY --chown=zaplabs:zaplabs package.json /opt/node/app/package.json
COPY --chown=zaplabs:zaplabs package-lock.json /opt/node/app/package-lock.json

USER zaplabs
WORKDIR /opt/node/app
RUN npm install --production

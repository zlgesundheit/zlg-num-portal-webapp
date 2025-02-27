# Copyright 2021 Vitagroup AG
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

### STAGE 1: Build ###
FROM node:16-alpine3.11 AS build
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm install
ARG ENVIRONMENT=deploy
RUN npm run build -- --configuration=${ENVIRONMENT}

### STAGE 2: Run ###
FROM nginx:1.21.0-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/num-portal-webapp /usr/share/nginx/html

# Katniss

A smart way to analyse your files.

## Build, Coverage and Dependency Reports

| Build                                      | Coverage                                            | Agent                                                                              | App                                                                            |
|:--------------------------------------------:|:-----------------------------------------------------:|:------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------:|
| [![CircleCI][img-circleci]][link-circleci] | [![Coverage Status][img-coverage]][link-coverage]   | [![dependencies Status][img-agent-dependencies]][link-agent-dependencies]          | [![dependencies Status][img-app-dependencies]][link-app-dependencies]          | 
|                                            |                                                     | [![devDependencies Status][img-agent-devdependencies]][link-agent-devdependencies] | [![devDependencies Status][img-app-devdependencies]][link-app-devdependencies] |


## Applications

Katniss consists two applications. First one is `agent`, which should be run on the machine that has direct 
file system access to the files. Second application is `app`, which analyses the files, finds duplicates. 
For `app` to be able to analyse files, `agent` needs to run and send the results to relevant kafka topic so
`app` can read and analyse them.

## Running development environment

Both `app` and `agent` requires Kafka as a must dependency. You can run it locally with 
[kafak-docker](https://github.com/wurstmeister/kafka-docker). Also current configuration requires Logstash 
as well. You can either update the configuration file to not to use Logstash or you can run ELK stack 
locally with [docker-elk](https://github.com/deviantony/docker-elk).

<!--Links -->
[link-circleci]:https://circleci.com/gh/mzaferyahsi/katniss
[img-circleci]:https://circleci.com/gh/mzaferyahsi/katniss.svg?style=svg

[link-coverage]:https://coveralls.io/github/mzaferyahsi/katniss?branch=master
[img-coverage]:https://coveralls.io/repos/github/mzaferyahsi/katniss/badge.svg?branch=master

[link-agent-dependencies]:https://david-dm.org/mzaferyahsi/katniss?path=agent
[img-agent-dependencies]:https://david-dm.org/mzaferyahsi/katniss/status.svg?path=agent

[link-agent-devdependencies]:https://david-dm.org/mzaferyahsi/katniss?type=dev&path=agent
[img-agent-devdependencies]:https://david-dm.org/mzaferyahsi/katniss/dev-status.svg?path=agent

[link-app-dependencies]:https://david-dm.org/mzaferyahsi/katniss?path=app
[img-app-dependencies]:https://david-dm.org/mzaferyahsi/katniss/status.svg?path=app

[link-app-devdependencies]:https://david-dm.org/mzaferyahsi/katniss?type=dev&path=app
[img-app-devdependencies]:https://david-dm.org/mzaferyahsi/katniss/dev-status.svg?path=app



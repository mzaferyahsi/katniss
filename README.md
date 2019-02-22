# Katniss

A smart way to analyse your files.

## Build, Coverage and Dependency Reports

| Build                                      | Coverage                                            | Agent                                                                              | App                                                                            |
|:--------------------------------------------:|:-----------------------------------------------------:|:------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------:|
| [![Build Status][img-build]][link-build] | [![Coverage Status][img-coverage]][link-coverage]   | [![dependencies Status][img-agent-dependencies]][link-agent-dependencies]          | [![dependencies Status][img-app-dependencies]][link-app-dependencies]          | 
|                                            |                                                     | [![devDependencies Status][img-agent-devdependencies]][link-agent-devdependencies] | [![devDependencies Status][img-app-devdependencies]][link-app-devdependencies] |


## Applications

Katniss consists following applications.

### Agent
`agent` does file system related actions (like finding files, getting information like size and hash of the 
file). So, it should be run on the machine that has direct file system access to the files. Files discovered
by `agent` will be sent to relevant kafka topic with the absolute path. If you will be running multiple 
agents, please make sure to have the files mounted/accessible in the same location across all agents.

### App
`app` analyses the files (like finding duplicates) that have been discovered by agent. 
For `app` to be able to analyse files, `agent` needs to run and send the results to relevant kafka topic so
`app` can do the analysis on the results.

## Running development environment

Both `app` and `agent` requires Kafka as a must dependency. You can run it locally with 
[kafak-docker](https://github.com/wurstmeister/kafka-docker). Also current configuration requires Logstash 
as well. You can either update the configuration file to not to use Logstash or you can run ELK stack 
locally with [docker-elk](https://github.com/deviantony/docker-elk).

<!--Links -->
[link-build]:https://travis-ci.org/mzaferyahsi/katniss
[img-build]:https://travis-ci.org/mzaferyahsi/katniss.svg?branch=master

[link-coverage]:https://codecov.io/gh/mzaferyahsi/katniss
[img-coverage]:https://codecov.io/gh/mzaferyahsi/katniss/branch/master/graph/badge.svg

[link-agent-dependencies]:https://david-dm.org/mzaferyahsi/katniss?path=agent
[img-agent-dependencies]:https://david-dm.org/mzaferyahsi/katniss/status.svg?path=agent

[link-agent-devdependencies]:https://david-dm.org/mzaferyahsi/katniss?type=dev&path=agent
[img-agent-devdependencies]:https://david-dm.org/mzaferyahsi/katniss/dev-status.svg?path=agent

[link-app-dependencies]:https://david-dm.org/mzaferyahsi/katniss?path=app
[img-app-dependencies]:https://david-dm.org/mzaferyahsi/katniss/status.svg?path=app

[link-app-devdependencies]:https://david-dm.org/mzaferyahsi/katniss?type=dev&path=app
[img-app-devdependencies]:https://david-dm.org/mzaferyahsi/katniss/dev-status.svg?path=app

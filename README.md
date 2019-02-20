# Katniss

A smart way to analyse your files.

## Build and Coverage Reports

[![CircleCI](https://circleci.com/gh/mzaferyahsi/katniss.svg?style=svg)][link-circleci]
[![Coverage Status](https://coveralls.io/repos/github/mzaferyahsi/katniss/badge.svg?branch=master)][link-coverage]

| Agent                                                                              | App                                                                            |
|------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| [![dependencies Status][img-agent-dependencies]][link-agent-dependencies]          | [![dependencies Status][img-app-dependencies]][link-app-dependencies]          | 
| [![devDependencies Status][img-agent-devdependencies]][link-agent-devdependencies] | [![devDependencies Status][img-app-devdependencies]][link-app-devdependencies] |


## Applications

Katniss consists two applications. First one is `agent`, which should be run on the machine that has direct file system access to the files.
Second application is `app`, which analyses the files, finds duplicates. For `app` to be able to analyse files, `agent` needs to run and
send the results to relevant kafka topic so `app` can read and analyse them.

## Running development environment

Both `app` and `agent` requires Kafka as a must dependency. You can run it locally with 
[kafak-docker](https://github.com/wurstmeister/kafka-docker). Also current configuration requires Logstash as well. You can either 
update the configuration file to not to use Logstash or you can run ELK stack locally with [docker-elk](https://github.com/deviantony/docker-elk).

[link-circleci]:https://circleci.com/gh/mzaferyahsi/katniss
[link-coverage]:https://coveralls.io/github/mzaferyahsi/katniss?branch=master

[link-agent-dependencies]:https://david-dm.org/mzaferyahsi/katniss?path=agent
[link-agent-devdependencies]:https://david-dm.org/mzaferyahsi/katniss?type=dev&path=agent

[link-app-dependencies]:https://david-dm.org/mzaferyahsi/katniss?path=app
[link-app-devdependencies]:https://david-dm.org/mzaferyahsi/katniss?type=dev&path=app

[img-agent-dependencies]:https://david-dm.org/mzaferyahsi/katniss/status.svg?path=agent
[img-agent-devdependencies]:https://david-dm.org/mzaferyahsi/katniss/dev-status.svg?path=agent

[img-app-dependencies]:https://david-dm.org/mzaferyahsi/katniss/status.svg?path=app
[img-app-devdependencies]:https://david-dm.org/mzaferyahsi/katniss/dev-status.svg?path=app

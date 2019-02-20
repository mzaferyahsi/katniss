# Katniss

[![CircleCI](https://circleci.com/gh/mzaferyahsi/katniss.svg?style=svg)](https://circleci.com/gh/mzaferyahsi/katniss)
[![Coverage Status](https://coveralls.io/repos/github/mzaferyahsi/katniss/badge.svg?branch=master)](https://coveralls.io/github/mzaferyahsi/katniss?branch=master)
[![devDependencies Status](https://david-dm.org/mzaferyahsi/katniss/dev-status.svg)](https://david-dm.org/mzaferyahsi/katniss?type=dev)
[![dependencies Status](https://david-dm.org/mzaferyahsi/katniss/status.svg)](https://david-dm.org/mzaferyahsi/katniss)

A smart way to analyse your files.

## Applications

Katniss consists two applications. First one is `agent`, which should be run on the machine that has direct file system access to the files.
Second application is `app`, which analyses the files, finds duplicates. For `app` to be able to analyse files, `agent` needs to run and
send the results to relevant kafka topic so `app` can read and analyse them.

## Running development environment

Both `app` and `agent` requires Kafka as a must dependency. You can run it locally with 
[kafak-docker](https://github.com/wurstmeister/kafka-docker). Also current configuration requires Logstash as well. You can either 
update the configuration file to not to use Logstash or you can run ELK stack locally with [docker-elk](https://github.com/deviantony/docker-elk).

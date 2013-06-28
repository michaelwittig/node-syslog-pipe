`````
                                                   ___
       __                                         /\_ \
  ___ /\_\    ___     ___   __  __    ___         \//\ \     ___      __      __      __   _ __
 /'___\/\ \ /' _ `\  / __`\/\ \/\ \  / __`\  _______\ \ \   / __`\  /'_ `\  /'_ `\  /'__`\/\`'__\
/\ \__/\ \ \/\ \/\ \/\ \L\ \ \ \_/ |/\ \L\ \/\______\\_\ \_/\ \L\ \/\ \L\ \/\ \L\ \/\  __/\ \ \/
\ \____\\ \_\ \_\ \_\ \____/\ \___/ \ \____/\/______//\____\ \____/\ \____ \ \____ \ \____\\ \_\
 \/____/ \/_/\/_/\/_/\/___/  \/__/   \/___/          \/____/\/___/  \/___L\ \/___L\ \/____/ \/_/
                                                                      /\____/ /\____/
                                                                      \_/__/  \_/__/
`````

# cinovo-syslog-pipe

cinovo-syslog-pipe can forward syslog udp packages to [cinovo-logger](https://github.com/cinovo/node-logger).
It can help you to send logs from your system to AWS SQS or SNS.

## Getting started

### At first you must install the pipe

    npm install -g cinovo-syslog-pipe

### Next you can run it

`````
syslogpipe --port=8514 --console
`````

### Forward your local syslog to 8514

You must configure a forwarding rule in your syslogd.

/etc/rsyslog.conf
`````
*.* @localhost:8514
`````

Restart your syslogd.

### Log something to syslog

Send a message to your local syslog.
`````
logger "test"
`````
You should now se the log on your console.

### Done

Now you listen on port 8514 for udp packages in thr syslog format which are printed to console.

## CLI

You can start the pipe with `syslogpipe`.

### Available parameters
* `--port`: Number - UDP port to listen on

### Activate Endpoint

#### Console
* `--console`: Just activate the console endpoit

#### AWS

##### SQS
* `--aws-region`: String -
* `--aws-sqs-queue`: String -
* `--aws-access-key-id`: String -
* `--aws-secret-access-key`: String -

##### SNS
* `--aws-region`: String -
* `--aws-sns-topic`: String -
* `--aws-access-key-id`: String -
* `--aws-secret-access-key`: String -

## API

You could also use the pipe within node as a module.

### udp(port, logger)

To startlistening on the port for udp packages and forearding them to an instance of [cinovo-logger](https://github.com/cinovo/node-logger).

* `port`: Number
* `logger`: Logger

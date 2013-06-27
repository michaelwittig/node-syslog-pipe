var argv = require("named-argv"),
	pipe = require("../index"),
	logger = require("cinovo-logger");

var options = argv.opts;

if (!options.port) {
	throw new Error("no --port was given");
}
var port = parseInt(options.port, 10);
var endpoint = false;

if (options.console === true) {
	logger.append(require("cinovo-logger-console")(true, true, true, true));
	endpoint = true;
}

if (typeof options["aws-sns-topic"] === "string") {
	var region = options["aws-region"];
	var topicArn = options["aws-sns-topic"];
	var accessKeyId = undefined;
	if (typeof options["aws-access-key-id"] === "string") {
		accessKeyId = options["aws-access-key-id"];
	}
	var secretAccessKey = undefined;
	if (typeof options["aws-secret-access-key"] === "string") {
		secretAccessKey = options["aws-secret-access-key"];
	}
	logger.append(require("cinovo-logger-aws").sns(true, true, true, true, region, topicArn, accessKeyId, secretAccessKey));
	endpoint = true;
}

if (typeof options["aws-sqs-queue"] === "string") {
	var region = options["aws-region"];
	var queueUrl = options["aws-sqs-queue"];
	var accessKeyId = undefined;
	if (typeof options["aws-access-key-id"] === "string") {
		accessKeyId = options["aws-access-key-id"];
	}
	var secretAccessKey = undefined;
	if (typeof options["aws-secret-access-key"] === "string") {
		secretAccessKey = options["aws-secret-access-key"];
	}
	logger.append(require("cinovo-logger-aws").sqs(true, true, true, true, region, queueUrl, accessKeyId, secretAccessKey));
	endpoint = true;
}

if (endpoint === false) {
	throw Error("You must at least append on endpoint");
}

pipe(port, logger);


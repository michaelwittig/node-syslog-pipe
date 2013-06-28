var events = require("events"),
	assert = require("assert-plus"),
	dgram = require("dgram"),
	net = require("net"),
	libsyslog = require("./lib/syslog");

function mapFacilityToOrigin(facilityCode, facility) {
	return facility;
}

function mapSeverityToLevel(severityCode, severity) {
	switch(severityCode) {
		case 0: return "critical";
		case 1: return "critical";
		case 2: return "critical";
		case 3: return "error";
		case 4: return "error";
		case 5: return "info";
		case 6: return "info";
		case 7: return "debug";
		default: return "error";
	}
}

exports.tcp = function(port, logger) {
	assert.number(port, "port");
	assert.object(logger, "logger");
	var emitter = new events.EventEmitter();
	var s = net.createServer(function(c) {
		console.log("server connected");
		c.on("data", function(msg) {
			libsyslog.decodeMessage(msg, function(err, syslog) {
				if (err) {
					logger.error("syslogpipe", "Could not parse tcp syslog msg", syslog);
				} else {
					var level = mapSeverityToLevel(syslog.severityCode, syslog.severity);
					var origin = mapFacilityToOrigin(syslog.facilityCode, syslog.facility);
					logger[level](origin, syslog.msg, syslog);
				}
			});
		});
	});
	logger.on("endpoint_error", function(endpoint, err) {
		emitter.emit("error", err);
	});
	s.on("error", function(err) {
		emitter.emit("error", err);
	});
	s.on("close", function() {
		emitter.emit("closed");
	});
	s.listen(port, function() {
		emitter.emit("bound");
	});
	emitter.close = function() {
		emitter.emit("close");
		s.close();
	};
	return emitter;
};
exports.udp = function(port, logger) {
	assert.number(port, "port");
	assert.object(logger, "logger");
	var emitter = new events.EventEmitter();
	var s = dgram.createSocket("udp4");
	s.on("message", function(msg) {
		libsyslog.decodeMessage(msg, function(err, syslog) {
			if (err) {
				logger.error("syslogpipe", "Could not parse udp syslog msg", syslog);
			} else {
				var level = mapSeverityToLevel(syslog.severityCode, syslog.severity);
				var origin = mapFacilityToOrigin(syslog.facilityCode, syslog.facility);
				logger[level](origin, syslog.msg, syslog);
			}
		});
	});
	logger.on("endpoint_error", function(endpoint, err) {
		emitter.emit("error", err);
	});
	s.on("error", function(err) {
		emitter.emit("error", err);
	});
	s.on("close", function() {
		emitter.emit("closed");
	});
	s.bind(port, function() {
		emitter.emit("bound");
	});
	emitter.close = function() {
		emitter.emit("close");
		s.close();
	};
	return emitter;
};

function getSeverity(i) {
	switch(i) {
		case 0: return "Emergency";
		case 1: return "Alert";
		case 2: return "Critical";
		case 3: return "Error";
		case 4: return "Warning";
		case 5: return "Notice";
		case 6: return "Informational";
		case 7: return "Debug";
		default: return undefined;
	}
}

function getFacility(i) {
	switch(i) {
		case 0: return "kernel messages";
		case 1: return "user-level messages";
		case 2: return "mail system";
		case 3: return "system daemons";
		case 4: return "security/authorization messages";
		case 5: return "messages generated internally by syslogd";
		case 6: return "line printer subsystem";
		case 7: return "network news subsystem";
		case 8: return "UUCP subsystem";
		case 9: return "clock daemon";
		case 10: return "security/authorization messages";
		case 11: return "FTP daemon";
		case 12: return "NTP subsystem";
		case 13: return "log audit";
		case 14: return "log alert";
		case 15: return "clock daemon";
		case 16: return "local use 0";
		case 17: return "local use 1";
		case 18: return "local use 2";
		case 19: return "local use 3";
		case 20: return "local use 4";
		case 21: return "local use 5";
		case 22: return "local use 6";
		case 23: return "local use 7";
		default: return undefined;
	}
}

exports.decodeMessage = function(msg, callback) {
	var syslog = {
		facility: undefined,
		facilityCode: undefined,
		severity: undefined,
		severityCode: undefined,
		msg: undefined
	};
	var header = msg.toString("ascii");
	if (header[0] === "<") {
		var i = header.indexOf(">");
		if (2 < i && i < 5) {
			var pri = parseInt(header.substr(1, i - 1), 10);
			var severityCode = pri % 8;
			var facilityCode = (pri - severityCode) / 8;
			syslog.facilityCode = facilityCode;
			syslog.severityCode = severityCode;
			syslog.facility = getFacility(facilityCode);
			syslog.severity = getSeverity(severityCode);
			syslog.msg = header.substr(i + 1); // TODO this is not really correct but nobody seems to be doing it like http://tools.ietf.org/html/rfc5424
			callback(undefined, syslog);
		} else {
			callback(new Error("PRI must be between 3 and 5 characters"), undefined);
		}
	} else {
		callback(new Error("First character not an <"), undefined);
	}
};

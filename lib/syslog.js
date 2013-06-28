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
	try {
		var header = msg.toString("ascii");
		var syslog = {
			facility: undefined,
			facilityCode: undefined,
			severity: undefined,
			severityCode: undefined,
			date: undefined,
			host: undefined,
			app: undefined,
			pid: undefined,
			msg: undefined,
			oirignal: header
		};
		if (header[0] !== "<") {
			callback(new Error("First character not an <"), syslog);
			return;
		}
		try {
			var i = header.indexOf(">");
			var pri = parseInt(header.substr(1, i - 1), 10);
			var severityCode = pri % 8;
			var facilityCode = (pri - severityCode) / 8;
			syslog.facilityCode = facilityCode;
			syslog.severityCode = severityCode;
			syslog.facility = getFacility(facilityCode);
			syslog.severity = getSeverity(severityCode);
			try {
				/* var j = header.indexOf("[");
				var headerDateHistApp = header.substring(i + 1, j);
				var s = headerDateHistApp.split(" ");
				syslog.date = s.slice(0, s.length-2).join(" ");
				syslog.host = s[s.length -2];
				syslog.app = s[s.length -1];
				syslog.pid = parseInt(header.substring(j + 1, header.length -1), 10);
				syslog.msg = msg.slice(e + 3).toString("utf8");*/

				var pheader = header.substr(i + 1);
				var s = pheader.split(" ");
				syslog.date = s.slice(0, 3).join(" ");
				syslog.host = s[3];
				var aheader = s[4];
				if (aheader.indexOf("[") !== -1 && aheader.indexOf("]") !== -1) {
					syslog.app = s[4].substring(0, aheader.indexOf("["));
					syslog.pid = s[4].substring(aheader.indexOf("[") + 1, aheader.indexOf("]"));
					syslog.msg = msg.slice(header.indexOf(syslog.app + "[" + syslog.pid + "]:") + syslog.app.length + syslog.pid.length + 4).toString("utf8");
				} else {
					syslog.app = s[4].substr(0, s[4].length - 1);
					syslog.msg = msg.slice(header.indexOf(syslog.app + ":") + syslog.app.length + 2).toString("utf8");
				}
				callback(undefined, syslog);
			} catch (err) {
				callback(err, syslog);
			}
		} catch (err) {
			callback(err, syslog);
		}
	} catch (err) {
		callback(err, undefined);
	}
};

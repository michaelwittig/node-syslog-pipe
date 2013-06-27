var assert = require("assert-plus"),
	pipe = require("../index"),
	logger = require("cinovo-logger");

logger.append(require("cinovo-logger-console")(false, false, false, false));

describe("API", function() {
	describe("()", function() {
		it("should work if all params are set", function(done) {
			var p = pipe(8541, logger);
			logger.once("level_info", function(log) {
				assert.equal(log.origin, "user-level messages");
				p.close();
				done();
			});
			require("child_process").exec('logger "test"', function(err) {
				if (err) {
					assert.fail(err);
				}
			});
		});
	});
});

module.exports = (code) => {
	return (
		code +
		"plugin.prototype.onStart = plugin.prototype.start;plugin.prototype.onStop = plugin.prototype.stop;module.exports = plugin;"
	);
};

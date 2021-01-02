module.exports = (code) => {
	return (
		code +
		"plugin.prototype.startPlugin = plugin.prototype.start;plugin.prototype.pluginWillUnload = plugin.prototype.stop;module.exports = plugin;"
	);
};

define(function(require, exports) {

	exports.sformat = function(source, opt){
		return source.replace(/#\{(.+?)\}/g, function(match, key){
			var replacer = opt[key];

			return ('undefined' == typeof replacer ? '' : replacer);
		});
	};

	exports.trim = function(source){
		return source.replace(/^\s*|\s*$/g, '');
	}
});
<?php
	
	if($_SERVER['SERVER_NAME'] === 'localhost'){
		define('DB_HOST', 'localhost');
		define('DB_POST', '3306');
		define('DB_USERNAME', 'root');
		define('DB_PASSWORD', 'root');
		define('DB_NAME', 'favorit');
	}else{
		define('DB_HOST', SAE_MYSQL_HOST_M);
		define('DB_POST', SAE_MYSQL_PORT);
		define('DB_USERNAME', SAE_MYSQL_USER);
		define('DB_PASSWORD', SAE_MYSQL_PASS);
		define('DB_NAME', SAE_MYSQL_DB);
	}


	require_once './humming/humming.php';

	# TODO
	# 接口参数需要编码？
	# url使用了全角输入
	# 自定义事件会重复绑定很多，需要清理
	# 导出收藏夹
	# js/css缓存问题
	# 使用SAE的登录
	# 获取favicon.ico,用定时器获取
	# 做客户端适配
	# 完成所有注释中的TODO
?>
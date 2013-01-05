<?php
	if(!defined("APP_PATH")) define("APP_PATH", dirname($_SERVER['SCRIPT_FILENAME']).'/');
	if(!defined("TPL_PATH")) define("TPL_PATH", APP_PATH.'tpl/');
	define("HUMMING_PATH", dirname(__FILE__).'/');

	# require
	require_once HUMMING_PATH.'Model.class.php';
	require_once HUMMING_PATH.'View.class.php';
	require_once HUMMING_PATH.'Action.class.php';

	class humming {
		public static function run(){
			$m = empty($_GET['m']) ? 'index' : $_GET['m'];
			$a = empty($_GET['a']) ? 'index' : $_GET['a'];

			$ins = self::mod($m);
			$ins->$a();
		}
		public static function mod($m){
			require_once APP_PATH.'Control/'.$m.'Action.class.php';

			$c = $m.'Action';
			return new $c;
		}
	}

	/**
	  *	模型操作快捷方式
	  */
	function M(){
		return new Model();
	}

	/**
	  *	控制器操作快捷方式
	  */
	function A($a){
		return humming::mod($a);
	}

	humming::run();
?>
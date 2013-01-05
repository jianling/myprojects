<?php
	class Model {
		private static $DB_link;
		private $_sql = '';

		public static function connect(){
            $link = mysql_connect(DB_HOST.':'.DB_POST, DB_USERNAME, DB_PASSWORD);
			if(!link){
				die('Could not connet:'.mysql_error());
			}
			mysql_query('set names utf8');
			self::$DB_link = $link;
			mysql_select_db(DB_NAME, self::$DB_link) or die(mysql_error());
		}

		public function __construct(){
			if(!extension_loaded('mysql')){
				die('Not support mysql.');
			}

			self::connect();
		}

		public function query($query){
			$this->queryStr = $query;

			# mysql_query返回true只表示sql执行不出错，但不表示sql达到预期效果，比如删除一条不存在的记录，也会返回true，此时需要通过影响的行数来判断是否达到预期
			$queryID = mysql_query($query);

			if(false === $queryID){
				$this->error();

				return false;
			}

			# mysql_query() 仅对 SELECT，SHOW，EXPLAIN 或 DESCRIBE 语句返回一个资源标识符，如果查询执行不正确则返回 FALSE。
			# 对于其它类型的 SQL 语句， mysql_query() 在执行成功时返回 TRUE，出错时返回 FALSE。
			if(is_resource($queryID)){
				while($row = mysql_fetch_assoc($queryID)){
					$result[] = $row;
				}
			}elseif(!$queryID){
				$this->error();

				return false;
			}

			# 如果没有记录，返回一个空数组
			if(!is_array($result)) $result = array();

			# 获取本次query影响到的行数
			preg_match('/^([^\s]*)\s/', $query, $match);
			if('select' == $match[1]){
				$this->numRows = mysql_num_rows($queryID);
			}else if(in_array($match[1], array('insert', 'update', 'delete'))){
				$this->numRows = mysql_affected_rows(self::$DB_link);
			}else{
				$this->numRows = 'unknown';
			}

			return $result;
		}

		public function debug(){
			$this->debug = true;
		}

		public function close(){
			self::$DB_link && mysql_close(self::$DB_link);
			self::$DB_link = 0;
			$this->error = '';
		}

		public function error(){
			$this->error = mysql_error(self::$DB_link);
			if($this->debug){
				$this->error = '\n'.$this->error.' SQL query:'.$this->queryStr.'\n';
			}

			return $this->error;
		}
	}
?>
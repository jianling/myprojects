<?php
	class urlAction extends Action {

		function __construct(){
			header('Content-Type:text/javascript');
		}

		/**
		 * 获取所有的url，以树的形式返回
		 */
		public function geturls(){
			$url_records = M()->query("select * from url");
			$folder_records = M()->query("select folder_id,folder_name,parent_folder_id from folder");

			# 将url按文件夹分组
			$url_groups = array();
			foreach($url_records as $record){
				if(!$url_groups[$record['folder_id']]){
					$url_groups[$record['folder_id']] = array();
				}
				$url_groups[$record['folder_id']][] = array($record['name'], $record['url'], $record['id']);
			}

			# 将文件夹的id用作键值
			$folders = array();
			foreach($folder_records as $record){
				$record['name'] = $record['folder_name'];
				$record['urls'] = array();
				$record['children'] = array();
				$folders[$record['folder_id']] = $record;
			}

			# 将url转存到各个文件夹中
			foreach($url_groups as $group_id=>$group){
				$folders[$group_id]['urls'] = $group;
			}

			# 倒置文件夹，键使用字符串形式，比如"3"才能正常倒置
			$folders_ = array();
			while(count($folders)){
				$folder = array_pop($folders);
				$folders_['_'.$folder['folder_id']] = $folder;
			}
			$folders = $folders_;

			# 将子文件夹移动到父文件夹中
			foreach($folders as $key=>$folder){
				$parent_folder_id = $folder['parent_folder_id'];
				if(!is_array($folders['_'.$parent_folder_id]['children'])){
					$folders['_'.$parent_folder_id]['children'] = array();
				}
				array_unshift($folders['_'.$parent_folder_id]['children'], $folders[$key]);
				unset($folders[$key]);
			}

			if($folders['_0']){
				echo json_encode($folders['_0']);
			}else{
				echo '{}';
			}
			
		}

		/**
		 * 添加一个url
		 * @param {String} folder_id 文件夹id
		 * @param {String} name url的名称
		 * @param {String} url url
		 */
		public function addurl(){
			$folder_id = $_GET['folder_id'];
			$name = $_GET['name'];
			$url = $_GET['url'];

			$records = M()->query("select * from folder where folder_id=$folder_id");
			if(!$records){
				$records = array();
			}
			if(count($records) == 0){
				$result['code'] = 0;
				$result['msg'] = '不存在指定的文件夹';

				echo json_encode($result);
				return;
			}

			if(!trim($name) || !trim($url)){
				$result['code'] = 0;
				$result['msg'] = '请将表单填写完整';

				echo json_encode($result);
				return;
			}

			if(false !== M()->query("insert into url values(NULL, '$folder_id', '$name', '$url', 1)")){
				$url_id = mysql_insert_id();

				$result['code'] = 1;
				$result['folder_id'] = $url_id;
			}else{
				$result['code'] = 0;
			}

			echo json_encode($result);
		}

		/**
		 * 更新一个url
		 * @param {String} id url的id
		 * @param {String} folder_id 文件夹id
		 * @param {String} name url的名称
		 * @param {String} url url
		 */
		public function updateurl(){
			$id = $_GET['id'];

			if(!$id){
				$result['code'] = 1;
				$result['msg'] = '未指定id';
				echo json_encode($result);
				return;
			}

			$where_query = '';
			if(!empty($_GET['folder_id'])){
				$where_query .= " folder_id = ".$_GET['folder_id']."";
			}
			if(!empty($_GET['name'])){
				$where_query .= " name = '".$_GET['name']."'";
			}
			if(!empty($_GET['url'])){
				$where_query .= " url = '".$_GET['url']."'";
			}

			if(!empty($where_query)){
				$where_query = 'set'.$where_query;
			}

			if(false !== M()->query("update url $where_query where id=$id")){
				$result['code'] = 1;
			}else{
				$result['code'] = 0;
			}

			echo json_encode($result);
		}

		/**
		 * 删除一个url
		 * @param {String} id url的id
		 */
		public function delurlbyid(){
			$id = $_GET['id'];

			if(false !== M()->query("delete from url where id=$id")){
				$result['code'] = 1;
			}else{
				$result['code'] = 0;
			}

			echo json_encode($result);
		}

		/**
		 * 导出收藏夹
		 */
		public function export(){
			
		}
	}
?>
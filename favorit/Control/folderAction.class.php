<?php
	class folderAction extends Action {

		function __construct(){
			header('Content-Type:text/javascript');
		}

		/**
		 * 添加一个文件夹
		 * @param {String} folder_name 文件夹名
		 * @param {String} folder_parent_id 该文件夹的父文件夹id
		 */
		public function addfolder(){
			$folder_name = urldecode($_GET['folder_name']);
			$parent_folder_id = $_GET['parent_folder_id'];

			if(!trim($folder_name)){
				$result['code'] = 0;
				$result['msg'] = '文件夹名称不能为空';

				echo json_encode($result);
				return;
			}

			//检查文件夹是否存在
			$records = M()->query("select * from folder where folder_id=$parent_folder_id");
			if(!$records){
				$records = array();
			}
			if(count($records) == 0 && (String)$parent_folder_id != '0'){
				$result['code'] = 0;
				$result['msg'] = '不存在指定的父文件夹';

				echo json_encode($result);
				return;
			}

			$records = M()->query("select * from folder where folder_name='$folder_name' AND parent_folder_id=$parent_folder_id");
			if(!$records){
				$records = array();
			}
			if(count($records) > 0){
				$result['code'] = 0;
				$result['msg'] = '已存在该文件夹';

				echo json_encode($result);
				return;
			}

			if(false !== M()->query("insert into folder values(NULL, '$folder_name', '$parent_folder_id', 1)")){
				$folder_id = mysql_insert_id();

				$result['code'] = 1;
				$result['folder_id'] = $folder_id;
			}else{
				$result['code'] = 0;
			}

			echo json_encode($result);
		}

		/**
		 * 重命名一个文件夹
		 * @param {String} folder_name 文件夹名
		 * @param {String} folder_parent_id 该文件夹的id
		 */
		public function renamefolder(){
			$folder_name = urldecode($_GET['folder_name']);
			$folder_id = $_GET['folder_id'];

			if(!trim($folder_name)){
				$result['code'] = 0;
				$result['msg'] = '文件夹名称不能为空';

				echo json_encode($result);
				return;
			}

			$records = M()->query("select * from folder where folder_id=$folder_id");
			if(!$records){
				$records = array();
			}
			if(count($records) == 0){
				$result['code'] = 0;
				$result['msg'] = '不存在该文件夹';

				echo json_encode($result);
				return;
			}

			if(false !== M()->query("update folder set folder_name='$folder_name' where folder_id=$folder_id")){
				$result['code'] = 1;
			}else{
				$result['code'] = 0;
			}

			echo json_encode($result);
		}

		/**
		 * 删除某个文件夹，会遍历删除该文件夹下面的所有子文件夹和URL
		 * @param {String} folder_id
		 */
		public function delfolder(){
			$folder_id = $_GET['folder_id'];

			//检查是否有子文件夹
			$records = M()->query("select * from folder where parent_folder_id=$folder_id");
			if(!$records){
				$records = array();
			}
			if(count($records) > 0){
				$result['code'] = 0;
				$result['msg'] = '不能删除非空文件夹';

				echo json_encode($result);
				return;
			}

			//检查是否有URL
			$records = M()->query("select * from url where folder_id=$folder_id");
			if(!$records){
				$records = array();
			}
			if(count($records) > 0){
				$result['code'] = 0;
				$result['msg'] = '不能删除非空文件夹';

				echo json_encode($result);
				return;
			}

			//删除文件夹
			if(false !== M()->query("delete from folder where folder_id=$folder_id")){
				$result['code'] = 1;
			}else{
				$result['code'] = 0;
			}

			echo json_encode($result);
		}
	}
?>
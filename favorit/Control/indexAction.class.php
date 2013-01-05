<?php
	class indexAction extends Action {
		public function index(){
			$count = M()->query("select count(*) as count from url");
			$this->assign("count", $count[0]['count']);
			$this->display("index.html");
		}
	}
?>
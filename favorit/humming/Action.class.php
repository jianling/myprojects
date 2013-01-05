<?php
	class Action {
		public function __construct(){
			$this->view = new View();
		}

		function __call($name, $arg){
			$this->display("$name.html");
		}

		public function assign($name, $var){
			$this->view->assign($name, $var);
		}

		public function getVar($name){
			return $this->view->getVar($name);
		}

		public function getAllVars(){
			return $this->view->getAllVars();
		}

		public function fetch($tpl){
			return $this->view->fetch($tpl);
		}

		public function display($tpl, $charset='utf-8', $contentType='text/html'){
			$this->view->display($tpl, $charset, $contentType);
		}
	}
?>
<?php
    class View {
        private $t_var = array();

        public function assign($name, $var){
            $this->t_var[$name] = $var;
        }

        public function getVar($name){
            if(isset($this->t_var[$name])){
                return $this->t_var[$name];
            }else{
                return false;
            }
        }

        public function getAllVars(){
            return $this->t_var;
        }

        public function fetch($tpl){
            $tplStr = '';

            if(is_file(TPL_PATH.$tpl)){
                $tplStr = file_get_contents(TPL_PATH.$tpl);
            }elseif(is_string($tpl)){
                $tplStr = $tpl;
            }else{
                return '';
            }

            foreach($this->t_var as $name=>$value){
                if(is_string($value)){
                    $tplStr = str_replace('{='.$name.'}', $value, $tplStr);
                }elseif(is_array($value)){
                    foreach($value as $key=>$val){
                        $tplStr = str_replace('{='.$name.'.'.$key.'}', $val, $tplStr);
                    }
                }
            }

            return $tplStr;
        }

        public function display($tpl, $charset='utf-8', $contentType='text/html'){
            header('Content-Type:'.$contentType.'; charset='.$charset);

            echo $this->fetch($tpl);
        }

    }
?>
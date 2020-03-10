<?php
class server_util_NodeNRC extends server_BasicObject
{
	var $level;
	var $childs = array();
	var $data;
	var $owner;
	function __construct($owner = null)
	{
		parent::__construct();
		if ($owner instanceof server_util_NodeNRC ){
			$this->owner = $owner;
			$owner->childs[] = $this;
		}else $owner = "00";
	}
	protected function doSerialize()
	{
		parent::doSerialize();
	}
	function init()
	{
		parent::init();
	}
	function deinit()
	{
		parent::deinit();
	}
	function setData($data){
		$this->level = floatval($data->level_spasi);
		$this->data = $data;
		$this->dataArray = (array) $data;
	}
}
?>
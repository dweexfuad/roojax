<?php
include_once "server/util/command.php";
class server_util_subversion extends server_BasicObject
{
	protected $path; 
	protected $repos;
	protected $svnPath;
	protected $user;
	protected $pwd;
	function __construct()
	{
		parent::__construct();		
		$this->user = "";
		$this->pwd = "";
	}	
	protected function doSerialize()
	{
		parent::doSerialize();
		$this->serialize("path","string");
		$this->serialize("repos","string");
		$this->serialize("svnPath","string");
		$this->serialize("user","string");
		$this->serialize("pwd","string");
	}
	function init()
	{
		parent::init();
	}
	function deinit()
	{
		parent::deinit();
	}
	function setPath($path){
		$this->path = $path;
	}	
	function setUser($user = "",$pwd = ""){
		$this->user = $user;
		$this->pwd = $pwd;
	}
	function checkout($path, $revNumber = null){
		$this->repos = $path;	
		if ($revNumber == null)
			return  runCommand("svn checkout $path $this->path --username $this->user --password $this->pwd --no-auth-cache --non-interactive",$this->svnPath);
		else return  runCommand("svn checkout $path $this->path -r $revNumber --username $this->user --password $this->pwd --no-auth-cache --non-interactive",$this->svnPath);
	}
	function setSvnPath($path = null){
		$this->svnPath = $path;
	}
	function commit($msg = ""){
		return  runCommand("svn commit -m '$msg' $this->path --username $this->user --password $this->pwd --no-auth-cache --non-interactive",$this->svnPath);
	}
	function update(){
		return  runCommand("svn update $this->path --no-auth-cache --non-interactive",$this->svnPath);
	}
	function info(){
		return  runCommand("svn info $this->path --username $this->user --password $this->pwd --no-auth-cache --non-interactive",$this->svnPath);
	}	
	function status($path = null, $recursive = null){
		if ($path == null) $path = $this->path;		
		return  runCommand("svn status $path",$this->svnPath);
	}
	function merge(){}
	function mergeinfo(){}
	function lock(){}
	function mkdir(){}
	function listed(){
		return  runCommand("svn list $this->path --username $this->user --password $this->pwd --no-auth-cache --non-interactive",$this->svnPath);
	}
	function add($files = null){
		if ($files == null)
			return  runCommand("svn add $this->path --force --username $this->user --password $this->pwd --no-auth-cache --non-interactive",$this->svnPath);
		else {
			$files = explode("<br>",$files);
			$ret = "";
			for ($i = 0; $i < count($files);$i++){
				if ($files[$i] != ""){
					$ret .= runCommand("svn add $files[$i] --username $this->user --password $this->pwd --no-auth-cache --non-interactive",$this->svnPath);					
				}
			}
			return $ret;	 
		}
	}
	function blame(){}
	function cat(){}
	function changelist(){}
	function cleanup(){
		return  runCommand("svn cleanup $this->path",$this->svnPath);
	}
	function copy(){}
	function delete(){}
	function diff(){}
	function export(){}
	function import(){}
	function help($syntax = ""){		
		return  runCommand("svn $syntax --help",$this->svnPath);		
	}
	function log($path){
		return  runCommand("svn log $path --username $this->user --password $this->pwd ",$this->svnPath);
	}
	function move(){}
	function resolve(){}
	function resolved(){}
	function revert(){}	
	
}
?>
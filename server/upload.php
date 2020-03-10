<?php
    if (substr_count($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip')) {
		ob_start("ob_gzhandler"); 
		header("Content-Encoding: gzip");
	}else
    ob_start();
	$result = "";

	$tempStr = $_POST['request'];	
	
	include("library.php");
    if (!defined('NEW_LINE'))
	   define("NEW_LINE", "<br>\r\n");
	
    define("WIN", "win");
    define("LINUX", "linux");

    // OS Base separator
    global $platform;
    global $dirSeparator;
    global $separator;
    global $serverDir;
    
    $serverDir = __FILE__;

    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN')
    {
        $platform = WIN;
    	$dirSeparator = "\\";
        $separator = ";";
    }
    else
    {
        $platform = LINUX;
    	$dirSeparator = "/";
        $separator = ":";
    }

global $rootDir;

$pos = strrpos($serverDir, $dirSeparator);
$serverDir = substr($serverDir, 0, $pos);
$pos = strrpos($serverDir, $dirSeparator);
$rootDir = substr($serverDir, 0, $pos);
$pos = strrpos($rootDir, $dirSeparator);
$path = $rootDir;
$rootDir = substr($rootDir,$pos);

//----------------------------------
//-------------- error_log8
	ignore_user_abort(true);
	set_time_limit(0);
	ini_set('display_errors', 'Off');
	ini_set ('track_errors', 'On');	 
	ini_set ('max_execution_time', 259200);	 
	ini_set ('max_input_time', 259200);	 
	//ini_set ('memory_limit', '2024M');
	//ini_set ('post_max_size	', '20M');
	ini_set ('log_errors',   'On');
	ini_set ('error_log',    $path.$dirSeparator."server".$dirSeparator."tmp".$dirSeparator."php_error.log");	
	//ini_set ('zlib.output_compression', 0);	
	//set_include_path(get_include_path() . PATH_SEPARATOR . "C:\wamp\bin\php\php5.2.6\PEAR");
	
	set_include_path(get_include_path() . PATH_SEPARATOR . $dirSeparator."appl".$dirSeparator."php".$dirSeparator."lib".$dirSeparator."php");
	set_include_path(get_include_path() . PATH_SEPARATOR . $dirSeparator."appl".$dirSeparator."php".$dirSeparator."lib".$dirSeparator."php".$dirSeparator."PEAR");
	set_include_path(get_include_path() . PATH_SEPARATOR . $path .$dirSeparator."server");	
	set_include_path(get_include_path() . PATH_SEPARATOR . $path .$dirSeparator."server/server/modules/codeplex");
	set_include_path(get_include_path() . PATH_SEPARATOR . $path .$dirSeparator."server/server/modules/codeplex/PHPExcel");
	set_include_path(get_include_path() . PATH_SEPARATOR . $path .$dirSeparator."server/server/modules/codeplex/PHPExcel/Shared");	
	set_include_path(get_include_path() . PATH_SEPARATOR . $path .$dirSeparator."server/server/modules/codeplex/PHPExcel/OLE");	
	set_time_limit(0);
	error_reporting (E_ALL & ~E_NOTICE &  ~E_DEPRECATED & ~E_USER_DEPRECATED & ~E_STRICT & ~E_WARNING);	
//------------------	
// You need to add server side validation and better error handling here
error_log("Uploaded ". json_encode($_GET) ." : POST ".json_encode($_POST));
$data = array();


if(isset($_GET['files']))
{  
    $error = false;
    $files = array();

    if (isset($_POST["uploadto"])){
        $uploaddir = str_replace("\\","",'./'.$_POST["uploadto"].'/');
        
        foreach($_FILES as $file)
        {
            error_log("Files  $uploaddir" . $file['name']);
            if(move_uploaded_file($file['tmp_name'], $uploaddir .basename($file['name']))){

            }else $error = true;
        }
        $data = ($error) ? array('error' => 'Proses upload file gagal. Silahkan cek kembali file anda') : array('files' => $files, "contents" => "");
    }else {
        $uploaddir = './tmp/';
        foreach($_FILES as $file)
        {
            error_log("Multi " . $file['name']);
            if(move_uploaded_file($file['tmp_name'], $uploaddir .basename($file['name'])))
            {
                uses("server_util_Map");
                $files[] = $file['name'];
                $paramCek = new server_util_Map();
                if (strpos($file['name'],".xls") > 1){
                    if (isset($_POST["cek"]) ){
                        $cek = $_POST["cek"];
                        uses("server_DBConnection_dbLib");
                        $db = new server_DBConnection_dbLib("orarra");
                        $rs = $db->execute("select kode_$cek, nama from bpc_". $cek . "_group  ");
                        while ($row = $rs->FetchNextObject(false)){
                            if ($cek == "vendor")
                                $paramCek->set($row->kode_vendor,  $row->nama );
                            else if ($cek == "cust")
                                $paramCek->set($row->kode_cust,  $row->nama );
                        }
                        
                    }else if (isset($_POST["service"])){

                    }
                    $contents = readXls($uploaddir .$file['name'], $paramCek);
                    
                    //error_log(json_encode($contents));
                }   
            }
            else
            {
                $error = true;
            }
        }
        $data = ($error) ? array('error' => 'Proses upload file gagal. Silahkan cek kembali file anda') : array('files' => $files, "contents" => $contents);
    }
    
}
else if(isset($_GET['file']))
{  
    $error = false;
    $files = array();
    $file = $_GET['file'];
    if (isset($_POST["uploadto"])){
        $uploaddir = './'.$_POST["uploadto"].'/';
        error_log("File " . $file['name']);
        if(move_uploaded_file($file['tmp_name'], $uploaddir .basename($file['name']))){

        }else $error = true;
        $data = ($error) ? array('error' => 'Proses upload file gagal. Silahkan cek kembali file anda') : array('files' => $files, "contents" => "");
    }else {
        $uploaddir = './tmp/';
        //foreach($_FILES as $file)
        {
            error_log("Single ".$file);
            {
                if (strpos($file,".xls") > 1){
                    $contents = readXls($uploaddir .$file);
                    if ($contents == false){
                        $error = true;
                    }
                }   
            }
        }
        $data = ($error) ? array('error' => 'There was an error uploading your files') : array('files' => $files, "contents" => $contents);
    }
}
else
{
    $data = array('success' => 'Form was submitted', 'formData' => $_POST);
}

function readXls($file, $param){
    
        uses("server_modules_codeplex_PHPExcel",false);
        $inputFileType = PHPExcel_IOFactory::identify($file);
        $objReader = PHPExcel_IOFactory::createReader($inputFileType);
        //$objReader = PHPExcel_IOFactory::createReader("Excel2007");
        $objReader->setReadDataOnly(true);
        $objPHPExcel = $objReader->load($file);
        //  Get worksheet dimensions
        $sheet = $objPHPExcel->getSheet(0); 
        $highestRow = $sheet->getHighestRow(); 
        $highestColumn = $sheet->getHighestColumn();

        //  Loop through each row of the worksheet in turn
        $contents = array();
        if (!isset($_POST["dataType"])){
            for ($row = 2; $row <= $highestRow; $row++){ 
                //  Read a row of data into an array
                $rowData = $sheet->rangeToArray('A' . $row . ':' . $highestColumn . $row,
                                                NULL,
                                                TRUE,
                                                FALSE);
                //untuk cek Vendor dan Customer sesuai KKP 
                $rowData[] = $param->get($rowData[0][1]);
                if (isset($_POST["service"])){
                    $fields = explode(",",$_POST["fields"]);
                    $line = array();
                    foreach ($rowData[0] as $key => $value) {
                        $line[$fields[$key]] = $value;
                    }
                    $contents[] = json_decode(json_encode($line));
                    error_log(json_encode($line));
                }else 
                    $contents[] = $rowData;
                //  Insert row data array into your database of choice here
            }
        }else{
            $contents = $file;
        }
        
        if (isset($_POST["service"])){
            include ("bpc.php");
            $param = explode(",",$_POST["param"]);
            
            if ($param == null)
                $param = array();
            if ($_POST["service"] == "callServices"){
                $paramTmp = array($param[0], $param[1], array());
                for($i = 2; $i < count($param);$i++){
                    $paramTmp[2][] = $param[$i];
                }
                if ($param[1] == "addPayrollPosMassUpload")
                    $paramTmp[2][] = json_encode($contents);
                else $paramTmp[2][] = $contents;
                $param = $paramTmp;
                error_log("Param =>" . json_encode($param));
            }else 
                $param[] = $contents;
           
           
            $ret =  callHandler(new bpc(), $_POST["service"],  $param);
            error_log($ret);
            if ($ret != "process completed"){
                return $ret;
            }else return $ret;
        }
    return $contents;
}
function callHandler($handler, $method, $param){
    $handlerFunc = array($handler, $method);
    //error_log("Call Method ". $method);
    if (is_callable($handlerFunc))
    {
        try
        {
            $result = call_user_func_array($handlerFunc, $param);
            return $result;
        }
        catch (Exception $e)
        {
            error_log("Error " . $e->getMessage());
        }
    }
}
//error_log(json_encode($data));
echo json_encode($data);

?>
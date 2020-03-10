<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
uses("server_util_Map");
uses("server_BasicObject");
uses("server_DBConnection_dbLib");

require_once("server/modules/mail/swift_required.php");
require_once("server/modules/mail/pop3.php");
require_once("server/modules/mail/mime_parser.php");
require_once("server/modules/mail/rfc822_addresses.php");
class server_util_mail extends server_BasicObject
{
	
	protected $smtpHost = "smtp.gmail.com";
	protected $smtpPort = 465;	
	protected $conType = "ssl";
	protected $user = "admin@mysai.co.id";
	protected $pwd = "saisaisai";
	protected $smtpTimeout = 10;
	protected $popPort = 110;		
	protected $popHost = "";	
	protected $dbLib;
	/*
	protected $smtpHost = "127.0.0.1";
	protected $smtpPort = 25;	
	protected $connType = "";
	protected $user = "dedy@mysai.co.id";
	protected $pwd = "Abcde106";
	protected $smtpTimeout = 10;
	protected $popPort = 110;		
	protected $popHost = "127.0.0.1";	
	protected $lokasi = "";
	*/
	function __construct($lokasi = null)
	{
		
		parent::__construct();	
		global $dbSetting;
		$this->dbLib = new server_DBConnection_dbLib($dbSetting);
		
		if(!isset($lokasi)) $lokasi = '01';
		if (isset($lokasi)) {
			$this->lokasi = $lokasi;
			$rs = $this->dbLib->execute("select * from mail_cfg where kode_lokasi = '".$lokasi."'");			
			if (gettype($rs) != "string" && !$rs->EOF){
			   while ($row = $rs->FetchNextObject(false)){
				  $this->user = $row->email;
				  $this->pwd = $row->pwd;
				  $this->connType = $row->conn_type;
				  $this->popHost = $row->incomingsvr;
				  $this->smtpHost = $row->outgoingsvr;
				  $this->popPort = $row->incomingport;
				  $this->smtpPort = $row->outgoingport;				  				  
			   }                     
			}
		}
		        
	}	
	protected function doSerialize()
	{
		parent::doSerialize();
		$this->serialize("lokasi","string", $this->lokasi);		
		$this->serialize("smtpHost","string", $this->smtpHost);
		$this->serialize("smtpPort","integer", $this->smtpPort);
		$this->serialize("connType","string", $this->connType);		
		$this->serialize("smtpTimeout","integer", $this->smtpTimeout);
		$this->serialize("popHost","string", $this->popHost);
		$this->serialize("popPort","integer", $this->popPort);
		$this->serialize("user","string", $this->user);
		$this->serialize("pwd","string", $this->pwd);
	}
	function init()
	{
		parent::init();
	}
	function deinit()
	{
		parent::deinit();
	}
	//------------------------------- Setter & Getter --------------------------------
	function setUser($username, $pwd,$type = "tls"){
		$this->user = $username;
		$this->pwd = $pwd;
		$this->connType = $type;		
	}
	function configSmtp( $host, $port = 25,$timeout = 10){
		$this->smtpHost = $host;
		$this->smtpPort = $port;			
		$this->smtpTimeout = $timeout;
	}
	function configPop3($host, $port = 110)
	{
		$this->popHost = $host;
		$this->popPort = $port;					
	}	
	function sendMail($from = null, $to, $subject, $body, $attach = null)
	{		
		//Declarate the necessary variables		
		//Create the Transport		
		if (!isset($from)){
			if (!isset($this->lokasi) || trim($this->lokasi) == "") $this->lokasi = "01";
			$rs = $this->dbLib->execute("select * from mail_cfg where kode_lokasi = '".$this->lokasi."'");						
			if (gettype($rs) != "string" && !$rs->EOF){			   
			   while ($row = $rs->FetchNextObject(false)){
				  $this->user = $row->email;
				  $this->pwd = $row->pwd;
				  $this->connType = $row->conn_type;
				  $this->popHost = $row->incomingsvr;
				  $this->smtpHost = $row->outgoingsvr;
				  $this->popPort = $row->incomingport;
				  $this->smtpPort = $row->outgoingport;				  				  				  
			   }                     
			}else error_log($rs);
		}		
		if ($this->connType == "-") $this->connType = null;
		try{
			$transport = Swift_SmtpTransport::newInstance($this->smtpHost, $this->smtpPort, $this->connType);				
			if ($transport)
				$transport->setTimeout($this->smtpTimeout);
			else throw ("error: Create Transport Layer");
			
			if (!empty($this->user)){
			    $transport->setUsername($this->user);
			    $transport->setPassword($this->pwd);
			}
            if (!isset($from)) $from = $this->user;						
			//Create the Mailer using your created Transport
			$mailer = Swift_Mailer::newInstance($transport);
			if ($mailer) ;
			else throw ("error: Create Mailer");
			//Create a message
			if ($attach != null)
				$message = Swift_Message::newInstance($subject)
			  ->setFrom(array($from))
			  ->setTo(array($to))
			  ->setBody($body,"text/html")
			  ->attach(Swift_Attachment::fromPath($attach));
			else $message = Swift_Message::newInstance($subject)
			  ->setFrom(array($from))
			  ->setTo(array($to))
			  ->setBody($body,"text/html");
			//Send the message
			
			if ($mailer->send($message)){
				return "Sent ". $to;
			}else{
				return "Failed";
			}
		}catch(Exception $e){
			error_log($e->getMessage());
			return "Failed::". $e->getMessage();
		}
	}
	
	function inbox($page = 1, $rowPerPage = 10){
		stream_wrapper_register('pop3', 'pop3_stream');  /* Register the pop3 stream handler class */
		$pop3=new pop3_class;
		$pop3->hostname=$this->popHost;             /* POP 3 server host name                      */
		$pop3->port=$this->popPort;                         /* POP 3 server host port,
							    usually 110 but some servers use other ports
							    Gmail uses 995                              */
		$pop3->tls=( $this->connType == "tls" ? 1: 0);                            /* Establish secure connections using TLS      */
		$user= $this->user;                        /* Authentication user name                    */
		$password=$this->pwd;                    /* Authentication password                     */
		$pop3->realm="";                         /* Authentication realm or domain              */
		$pop3->workstation="";                   /* Workstation for NTLM authentication         */
		$apop=0;                                 /* Use APOP authentication                     */
		$pop3->authentication_mechanism="USER";  /* SASL authentication mechanism               */
		$pop3->debug=0;                          /* Output debug information                    */
		$pop3->html_debug=0;                     /* Debug information is in HTML                */
		$pop3->join_continuation_header_lines=1; /* Concatenate headers split in multiple lines */

		if(($error=$pop3->Open())==""){
			if(($error=$pop3->Login($user,$password,$apop))==""){
				if(($error=$pop3->Statistics($messages,$size))==""){					
					uses("server_util_Map");
					$return= new server_util_Map();
					$start = ($page - 1) * $rowPerPage;
					$end = ($start + $rowPerPage);					
					$result=$pop3->ListMessages("",0);
					if(GetType($result)=="array"){
						for(Reset($result),$message=0;$message<$messages;Next($result),$message++){
							$size = $result[Key($result)];
							$msg = Key($result);												
							if(($error=$pop3->RetrieveMessage($msg,$headers,$body,-1))=="")
							{													
								$header = new server_util_Map();
								for($line=0;$line<count($headers);$line++){
									$value = HtmlSpecialChars($headers[$line]);
									$kode = substr($value,0,strpos($value,":"));
									$value= substr($value,strpos($value,":")+1);
									$header->set($kode,$value);
								}	
								$content = "";
								for($line=0;$line<count($body);$line++)
									$content .= HtmlSpecialChars($body[$line]). "\n";
								$header->set("Body",$content);	
							}
							$return->set($message,$header);
						}						
					}
					if($error=="" && ($error=$pop3->Close())=="")
						echo "<PRE>Disconnected from the POP3 server &quot;".$pop3->hostname."&quot;.</PRE>\n";						
					return $return;
				}
			}
		}
		if($error!="")
			return  "error: " . HtmlSpecialChars($error)."";
	}
	
	function getMessage($msgindex){
		stream_wrapper_register('pop3', 'pop3_stream');  /* Register the pop3 stream handler class */
		$pop3=new pop3_class;
		$pop3->hostname=$this->popHost;             /* POP 3 server host name                      */
		$pop3->port=$this->popPort;                         /* POP 3 server host port,
							    usually 110 but some servers use other ports
							    Gmail uses 995                              */
		$pop3->tls=$this->popType;                            /* Establish secure connections using TLS      */
		$user= $this->popUser;                        /* Authentication user name                    */
		$password=$this->popPwd;                    /* Authentication password                     */
		$pop3->realm="";                         /* Authentication realm or domain              */
		$pop3->workstation="";                   /* Workstation for NTLM authentication         */
		$apop=0;                                 /* Use APOP authentication                     */
		$pop3->authentication_mechanism="USER";  /* SASL authentication mechanism               */
		$pop3->debug=0;                          /* Output debug information                    */
		$pop3->html_debug=0;                     /* Debug information is in HTML                */
		$pop3->join_continuation_header_lines=1; /* Concatenate headers split in multiple lines */
		if(($error=$pop3->Open())==""){
			if(($error=$pop3->Login($user,$password,$apop))==""){
				if(($error=$pop3->Statistics($messages,$size))==""){
					if($messages>0){
						if(($error=$pop3->RetrieveMessage($msgindex,$headers,$body,2))=="")
						{					
							uses("server_util_Map");
							$header = new server_util_Map();
							for($line=0;$line<count($headers);$line++){								
								$header->set($line,HtmlSpecialChars($headers[$line]));
							}							
							$body = "";
							for($line=0;$line<count($body);$line++)
								$body .= HtmlSpecialChars($body[$line]);
							$result = new server_util_Map();
							$result->set("body",$body);
							$result->set("headers",$header);
							return $result;
						}
					}
				}
			}
		}
		if($error!="")
			return  "error: " . HtmlSpecialChars($error)."";		
	}
}

?>

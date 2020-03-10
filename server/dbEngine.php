<?php

function &ew_Connect() {
	$object =& new mysqlt_driver_ADOConnection();
	if (defined("EW_DEBUG_ENABLED")) $object->debug = TRUE;
	$object->port = PORT;
	$object->raiseErrorFn = 'ew_ErrorFn';
	$object->Connect(HOST, USER, PASS, DB);
	if (HARSET <> "") $object->Execute("SET NAMES '" . CHARSET . "'");
	$object->raiseErrorFn = '';
	return $object;
}

?>
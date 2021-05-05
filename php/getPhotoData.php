<?php 

$executionStartTime = microtime(true) / 1000;
$country = preg_replace('/\s+/', '-', $_REQUEST['country']);

$url;
if($country == "Central-African-Republic"){
	$url = "https://api.unsplash.com/search/photos?query=africa&client_id=4BysAZ8jjWLhxY7QeQW2Yk7bhXnnlf99uTY0s0ttQTU";
}else{
	$url = "https://api.unsplash.com/search/photos?query={$country}&client_id=4BysAZ8jjWLhxY7QeQW2Yk7bhXnnlf99uTY0s0ttQTU";
}



$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);

?>
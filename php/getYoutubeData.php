<?php 

$executionStartTime = microtime(true) / 1000;
$country = preg_replace('/\s+/', '-', $_REQUEST['country']);

$url = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=UCmmPgObSUPw1HL2lq6H4ffA&q={$country}&key=AIzaSyCvsp8SVAs7-J9mONpzI9cnqvhn-1s8GB4";


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
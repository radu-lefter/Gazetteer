
<?php


$country_wiki = preg_replace('/\s+/', '_', $_REQUEST['country']);
$country = preg_replace('/\s+/', '-', $_REQUEST['country']);
$date = date("Y-m-d", strtotime("-1 months"));


$data = file_get_contents("https://restcountries.eu/rest/v2/alpha/{$_REQUEST['country_iso']}");
$data = json_decode($data, true);
$capital = $data['capital'];

$executionStartTime = microtime(true) / 1000;

	
	$url1 = "https://restcountries.eu/rest/v2/alpha/{$_REQUEST['country_iso']}";

    $url2 = "https://en.wikipedia.org/api/rest_v1/page/summary/{$country_wiki}";

    $url3 = "https://api.unsplash.com/search/photos?query={$country}&client_id=4BysAZ8jjWLhxY7QeQW2Yk7bhXnnlf99uTY0s0ttQTU";

	$url4 = "https://newsapi.org/v2/everything?q={$country}&from={$date}&sortBy=popularity&apiKey=130f57bb770e4126ab3b0d2e2ec5e2a8";

	$url5 = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=UCmmPgObSUPw1HL2lq6H4ffA&q={$country}&key=AIzaSyCvsp8SVAs7-J9mONpzI9cnqvhn-1s8GB4";

	$url6 = "https://corona.lmao.ninja/v2/countries/{$_REQUEST['country']}?yesterday&strict&query";

	$url7 ="https://api.openweathermap.org/data/2.5/weather?q=$capital,{$_REQUEST['country_iso']}&units=metric&APPID=cf68da85a38201a07b3983c702e86457";


	$ch1 = curl_init();
	curl_setopt($ch1, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch1, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch1, CURLOPT_URL,$url1);

    $ch2 = curl_init();
	curl_setopt($ch2, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch2, CURLOPT_URL,$url2);

    $ch3 = curl_init();
	curl_setopt($ch3, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch3, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch3, CURLOPT_URL,$url3);

	$ch4 = curl_init();
	curl_setopt($ch4, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch4, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch4, CURLOPT_URL,$url4);

	$ch5 = curl_init();
	curl_setopt($ch5, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch5, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch5, CURLOPT_URL,$url5);

	$ch6 = curl_init();
	curl_setopt($ch6, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch6, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch6, CURLOPT_URL,$url6);

	$ch7 = curl_init();
	curl_setopt($ch7, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch7, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch7, CURLOPT_URL,$url7);


	$result1=curl_exec($ch1);
    $result2=curl_exec($ch2);
    $result3=curl_exec($ch3);
    $result4=curl_exec($ch4);
	$result5=curl_exec($ch5);
	$result6=curl_exec($ch6);
	$result7=curl_exec($ch7);

	curl_close($ch1);
    curl_close($ch2);
    curl_close($ch3);
    curl_close($ch4);
	curl_close($ch5);
	curl_close($ch6);
	curl_close($ch7);

	$decode1 = json_decode($result1,true);	
    $decode2 = json_decode($result2,true);
    $decode3 = json_decode($result3,true);
	$decode4 = json_decode($result4,true);
	$decode5 = json_decode($result5,true);
	$decode6 = json_decode($result6,true);
	$decode7 = json_decode($result7,true);

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data']['country'] = $decode1;
    $output['data']['wiki'] = $decode2;
    $output['data']['photo'] = $decode3;
	$output['data']['news'] = $decode4;
	$output['data']['youtube'] = $decode5;
	$output['data']['covid'] = $decode6;
	$output['data']['weather'] = $decode7;
    
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);

?>

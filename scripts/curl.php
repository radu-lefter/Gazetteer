
<?php

// 'https://restcountries.eu/rest/v2/name/canada'

// 'https://restcountries.eu/rest/v2/name/ireland'

// https://api.unsplash.com/search/photos?query=romania&client_id=4BysAZ8jjWLhxY7QeQW2Yk7bhXnnlf99uTY0s0ttQTU

$executionStartTime = microtime(true) / 1000;

	
	$url1 = "https://restcountries.eu/rest/v2/alpha/{$_REQUEST['country_iso']}";

    //$url2 = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles={$_REQUEST['country']}";
    $url2 = "https://en.wikipedia.org/api/rest_v1/page/summary/{$_REQUEST['country']}";

    $url3 = "https://api.unsplash.com/search/photos?query={$_REQUEST['country']}&client_id=4BysAZ8jjWLhxY7QeQW2Yk7bhXnnlf99uTY0s0ttQTU";


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


	$result1=curl_exec($ch1);
    $result2=curl_exec($ch2);
    $result3=curl_exec($ch3);
    //$result4=curl_exec($ch4);

	curl_close($ch1);
    curl_close($ch2);
    curl_close($ch3);
    //curl_close($ch4);

	$decode1 = json_decode($result1,true);	
    $decode2 = json_decode($result2,true);
    $decode3 = json_decode($result3,true);

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data']['country'] = $decode1;
    $output['data']['wiki'] = $decode2;
    $output['data']['photo'] = $decode3;
    
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);

?>



//Set buttons for showing modal
$("#btnGeneral").click(function() {
    $('#generalModal').modal('show');
  });

$("#btnWiki").click(function() {
    $('#wikiModal').modal('show');
  });

$("#btnPhotos").click(function() {
    $('#photosModal').modal('show');
  });

$("#btnCities").click(function() {
    $('#citiesModal').modal('show');
  });

$("#btnNobel").click(function() {
    $('#nobelModal').modal('show');
  });

$("#btnNews").click(function() {
    $('#newsModal').modal('show');
  });

$("#btnCovid").click(function() {
    $('#covidModal').modal('show');
  });

$("#btnYoutube").click(function() {
    $('#youtubeModal').modal('show');
  });

$("#btnCamera").click(function() {
    $('#cameraModal').modal('show');
  });

$(".button_close").click(function() {
    $('.modal').modal('hide');
});


//populate the select list

let dropdown = $('#countryDropdown');

dropdown.empty();

dropdown.append('<option selected="true" value="dummy" disabled>Choose country</option>');
dropdown.prop('selectedIndex', 0);


$.ajax({
        type: 'GET',
        url: "php/getCountriesNames.php",
        success: function (response) {

            var output = $.parseJSON(response);
            //console.log(output);

            if(response){
                for (let item of output) {
                    dropdown.append($('<option></option>').attr('value', item.iso_a2).text(item.name));
             }
            }
           
           
        },
    }).fail(function () {
        console.log("Error encountered!")
    });



    



//Create the map
var mymap = L.map('mapId').fitWorld();

//Set map to users current location
mymap.locate({setView: true, maxZoom: 5});

function getCoords(position){

    var crd = position.coords;
    console.log(crd);
    $.ajax({
        
        url: "php/getUserCountry.php",
        type: 'POST',
        data: {
            latitude: crd.latitude,
            longitude: crd.longitude
        },
        success: function (response) {
    
            //var output = $.parseJSON(response);
            // console.log(response);
    
            if(response){
                selectCountry(response["data"]["results"][0]["components"]["country"], response["data"]["results"][0]["components"]["ISO_3166-1_alpha-2"]);
            }
           
           
        },
    }).fail(function () {
        console.log("Error encountered!")
    });
}



// const successfulLookup = position => {
//     const { latitude, longitude } = position.coords;
//     fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=68d11922aad3402caf0baf9b8377a56b`)
//       .then(response => response.json())
//       //.then(response => console.log(response["results"][0]["components"]));
//       .then(response => selectCountry(response["results"][0]["components"]["country"], response["results"][0]["components"]["ISO_3166-1_alpha-2"]))
// }
if (window.navigator.geolocation) {
    window.navigator.geolocation.getCurrentPosition(getCoords, console.log);

   } 
//selectCountry("United Kingdom","GB");

//Add the map layer
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(mymap);



//Add interactivity on select
$('#countryDropdown').change(function(){
    let country = $('select option:selected').text();
    let country_iso = $('select option:selected').val();
    selectCountry(country, country_iso)
    
});


//Adding border around each country and fetching data

var geoson;
var markers = L.layerGroup().addTo(mymap);
var nf = Intl.NumberFormat();

function getNews(country){
    var newsHeader = document.getElementById('newsHeader');
    newsHeader.innerHTML = `Latest news related to ${country}`;
    $.ajax({
        url: "php/getNewsData.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: country
        },
        success: function(result) {

            console.log(result);

            if(result.status.name == "ok"){

                        
                        var newsTable =  document.getElementById('newsTable');
                        newsTable.innerHTML = "";
                        
                        for(let item of result['data']['articles']){
                            if(item['source']['id'] == "reuters" || item['source']['id'] == "bbc-news" || item['source']['id'] == "cnn"){
                                    
                                    tr = document.createElement('tr'); 
                                    td = document.createElement('td'); 
                                    td.innerHTML += `<a href="${item['url']}" target='_blank'>${item['title']}</a><br>`;
                                    tr.appendChild(td);
                                    newsTable.appendChild(tr);
                                    tr = document.createElement('tr'); 
                                    td = document.createElement('td'); 
                                    td.innerHTML += `<img src=${item['urlToImage']} alt="" style="width:280px"></img><br>`;
                                    tr.appendChild(td);
                                    newsTable.appendChild(tr);
                                    tr = document.createElement('tr'); 
                                    td = document.createElement('td'); 
                                    td.innerHTML += `<p>${item['description']}</p>`;
                                    tr.appendChild(td);
                                    newsTable.appendChild(tr);
                                    

                                    // li.innerHTML = `<img src=${item['urlToImage']} alt="" style="width:280px"></img><br>`;
                                    // li.innerHTML += `<a href="${item['url']}" target='_blank'>${item['title']}</a><br>`;
                                    // li.innerHTML += `<p>${item['description']}</p>`;
                                    // newsTable.appendChild(li);
                            }
                            
                            

                        }
                        if(newsTable.innerHTML == ""){
                            $('#newsTable').html(`<tr><td>Sorry, no news were found. Try again later.</td></tr>`);
                        }
             }

        },
        error: function() {
            console.log("News couldn't be loaded!");
        }
    }); 
}

function getNobels(country){
    $.ajax({
        url: "php/getNobelData.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: country
        },
        success: function(result) {

            console.log(result);

            if(result.status.name == "ok"){

                var nobelTable =  document.getElementById('nobelTable');
                nobelTable.innerHTML = "";

                if(result['data']['laureates'].length == 0){
                    $('#nobelTable').html(`<p>No nobel prize winners.</p>`)
                }else{
                    for (var i = 0; i < result['data']['laureates'].length; i++) {
                   
                        tr = document.createElement('tr'); 
                        td = document.createElement('td'); 
                        td.innerHTML = result['data']['laureates'][i]['fullName']['en'];
                        tr.appendChild(td);
                        
                        td = document.createElement('td'); 
                        td.innerHTML = result['data']['laureates'][i]['nobelPrizes'][0]['awardYear'];
                        tr.appendChild(td);
                         
                        td = document.createElement('td'); 
                        td.innerHTML = result['data']['laureates'][i]['nobelPrizes'][0]['category']['en'];
                        tr.appendChild(td);
                        nobelTable.appendChild(tr);

                    
                }
                    // for (var i = 0; i < result['data']['laureates'].length; i++) {
                    //     li = document.createElement('li');
                    //     li.innerHTML = `${result['data']['laureates'][i]['fullName']['en']} in ${result['data']['laureates'][i]['nobelPrizes'][0]['awardYear']} for ${result['data']['laureates'][i]['nobelPrizes'][0]['category']['en']}`;
                    //     list3.appendChild(li);
                    // }
                }
                
             }

        },
        error: function() {
            console.log("Nobels couldn't be loaded!");
        }
    }); 
}

function getPhotos(country){
    $.ajax({
        url: "php/getPhotoData.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: country
        },
        success: function(result) {

            console.log(result);

            if(result.status.name == "ok"){

                var photosTable =  document.getElementById('photosTable');
                photosTable.innerHTML = "";

                for(let i = 0; i<result['data']['results'].length; i+=2){
                    let second = i+1;
                    tr = document.createElement('tr'); 
                    td = document.createElement('td'); 
                    td.innerHTML = `<img src=${result['data']['results'][i]['urls']['small']} alt="" width="350px"></img>`;
                    tr.appendChild(td);
                    td = document.createElement('td'); 
                    td.innerHTML = `<img src=${result['data']['results'][second]['urls']['small']} alt="" width="350px"></img>`;
                    tr.appendChild(td);
                    photosTable.appendChild(tr);
                }

                // for(let item of result['data']['results']){                      
                //     listPhotos.innerHTML += `<img src=${item['urls']['small']} alt="" ></img>`;
                // }
  
             }

        },
        error: function() {
            console.log("Photos couldn't be loaded!");
        }
    }); 
}

function getWiki(country){
    $.ajax({
        url: "php/getWikiData.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: country
        },
        success: function(result) {

            console.log(result);

            if(result.status.name == "ok"){

                $('#wiki').html(result['data']['extract']+"<br><br>"+`<a href=${result['data']['content_urls']['desktop']['page']} target="_blank">Visit Wikipedia page!</a>`);
  
             }

        },
        error: function() {
            console.log("Wiki couldn't be loaded!");
        }
    }); 
}

function getCorona(country){
    $.ajax({
        url: "php/getCoronaData.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: country
        },
        success: function(result) {

            console.log(result);

            if(result.status.name == "ok"){

                if(result['data']["cases"]){
                    $('#cases').html("Total cases: " + nf.format(result['data']["cases"]));
                    $('#recovered').html("Total recovered: " + nf.format(result['data']["recovered"]));
                    $('#deaths').html("Total deaths: " + nf.format(result['data']["deaths"]));
                    $('#deathsToday').html("Deaths today: " + nf.format(result['data']["todayDeaths"]));
                    }else{
                        $('#cases').html("Sorry, no data found");
                        $('#recovered').html("Sorry, no data found"); 
                        $('#deaths').html("Sorry, no data found");
                        $('#deathsToday').html("Sorry, no data found");
                    }
  
             }

        },
        error: function() {
            console.log("Covid info couldn't be loaded!");
        }
    }); 
}

function getCities(country){
    $.ajax({
        url: "php/getCitiesData.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: country
        },
        success: function(result) {

            console.log(result);

            if(result.status.name == "ok"){

                var listCities =  document.getElementById('cities');
                        listCities.innerHTML = "";
                        if(result['data']){

                            let data = [];
                            for (let item of result['data']['data']) {
                                data.push({"city":item['city'], "population": item['populationCounts'][0]['value']});
                            }

                            data.sort((a, b) => parseFloat(b.population) - parseFloat(a.population));

                            
                            for (let item of data) {
                                li = document.createElement('li');
                                li.innerHTML = `${item["city"]} with ${nf.format(item["population"])} inhabitants`;
                                listCities.appendChild(li);
                            }
                        }
  
             }

        },
        error: function() {
            console.log("Cities couldn't be loaded!");
        }
    }); 
}

function getYoutube(country){
    $.ajax({
        url: "php/getYoutubeData.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: country
        },
        success: function(result) {

            console.log(result);

            if(result.status.name == "ok"){

                if(result['data']['items']){
                    $('#iframe_1').attr({src: 'https://www.youtube.com/embed/'+ result['data']['items'][0]['id']['videoId']});
                } else {
                    $('#video').html("Video not found");
                }
  
             }

        },
        error: function() {
            console.log("Youtube couldn't be loaded!");
        }
    }); 
}

function getCamera(country_iso){
    $.ajax({
        url: "php/getCameraData.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country_iso: country_iso
        },
        success: function(result) {

            console.log(result);

            if(result['data']['result']['webcams'][0] == undefined){
                $('#camera').html("Camera not found");
            } else {
                $('#camLoc').html(result['data']['result']['webcams'][0]['location']['region']+" - "+result['data']['result']['webcams'][0]['location']['city']);
                $('#iframe_2').attr({src: result['data']['result']['webcams'][0]['player']['year']['embed']});
            }


        },
        error: function() {
            console.log("Camera couldn't be loaded!");
        }
    }); 
}

function getGeneral(country_iso){
    $.ajax({
        url: "php/getGeneralData.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country_iso: country_iso
        },
        success: function(result) {

            console.log(result);

            if(result.status.name == "ok"){

                //Restcountries
                $('#countryName').html(result['data']['country']["name"]);
                $('#capital').html(result['data']['country']["capital"]);
                $('#continent').html(result['data']['country']["subregion"]);
                $('#population').html(nf.format(result['data']['country']["population"]));

                var para =  document.getElementById('language');
                para.innerHTML = "";
                
                for (var i = 0; i < result['data']['country']['languages'].length; i++) {
                    span = document.createElement('span');
                    span.innerText = `| ${result['data']['country']['languages'][i]['name']} | `;
                    para.appendChild(span);
                }

                $('#area').html(nf.format(result['data']['country']["area"]) + " km<sup>2</sup>");
                $('#currency').html(result['data']['country']["currencies"][0]["name"]);
                var currency = result['data']['exchange']['rates'][result['data']['country']["currencies"][0]["code"]];
                var fixed = currency.toFixed(2);
                $('#exchange').html("One USD is worth "+ fixed +" "+ result['data']['country']["currencies"][0]["code"]);
                $('#flagImg').attr({src: result['data']['country']['flag'], style: "width:30px"});
                $('#weather').html(result['data']['weather']['main']['temp'] + "&#8451; " + result['data']['weather']['weather'][0]['description']);
                $('#phone').html(result['data']['country']["callingCodes"][0]);
                $('#gini').html(result['data']['country']["gini"]);

                //Opencage
                if(result['data']['opencage']){
                    var sunrise = new Date((result['data']['opencage']['results'][0]['annotations']['sun']['rise']['apparent'] + result['data']['opencage']['results'][0]['annotations']['timezone']['offset_sec'])*1000);
                    var sunset = new Date((result['data']['opencage']['results'][0]['annotations']['sun']['set']['apparent']+ result['data']['opencage']['results'][0]['annotations']['timezone']['offset_sec'])*1000);
                $('#driving').html("On the "+ result['data']['opencage']['results'][0]['annotations']['roadinfo']['drive_on']+" side");
                $('#localTime').html(new Date(new Date().getTime() + result['data']['opencage']['results'][0]['annotations']['timezone']['offset_sec']*1000).toString().substr(0,25));
                $('#sunrise').html("Sun rises at "+ sunrise.toString().substr(16,8));
                $('#sunset').html("Sun sets at "+ sunset.toString().substr(16,8));
                }else{
                    $('#driving').html("");
                    $('#localTime').html("");
                    $('#sunrise').html("");
                    $('#sunset').html(""); 
                }

                var myIcon = L.Icon.extend({
                    options: {
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize:     [35, 42],
                        shadowSize:   [41, 41],
                        iconAnchor:   [12, 41],
                        shadowAnchor: [4, 62],
                        popupAnchor:  [1, -34]
                    }
                });
                var capital = new myIcon({iconUrl: 'capital.png'})

                var marker;
                if(result['data']['opencage'] != null){
                    marker = L.marker([result['data']['opencage']['results'][0]['geometry']['lat'], result['data']['opencage']['results'][0]['geometry']['lng']], {icon: capital}).bindPopup(`This is the capital city, ${result['data']['opencage']['results'][0]['components']['city']}!`);
                    markers.addLayer(marker);
                }
  
             }

        },
        error: function() {
            console.log("General data couldn't be loaded!");
        }
    }); 
}

function getTriposo(country_iso){
    $.ajax({
        url: "php/getTriposoData.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country_iso: country_iso
        },
        success: function(result) {

            console.log(result);

            if(result.status.name == "ok"){

                var myIcon = L.Icon.extend({
                    options: {
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize:     [35, 42],
                        shadowSize:   [41, 41],
                        iconAnchor:   [12, 41],
                        shadowAnchor: [4, 62],
                        popupAnchor:  [1, -34]
                    }
                });

                var city = new myIcon({iconUrl: 'city.png'}),
                    attraction = new myIcon({iconUrl: 'attraction.png'}),
                    island = new myIcon({iconUrl: 'island.png'}),
                    region = new myIcon({iconUrl: 'region.png'});


                
                var marker;
                
                for (let item of result['data']['attractions']['results']) {
                    var popup = L.popup({maxHeight: 225}).setContent(`<h4>${item['name']}</h4> <p>${item['intro']}</p> <img src=${item['images'][0]['source_url']} width="270" height="150">`);
                    marker = L.marker([item['coordinates']['latitude'], item['coordinates']['longitude']], {icon: attraction}).bindPopup(popup);
                    markers.addLayer(marker);
                    }

                for (let item of result['data']['popularCities']['results']) {
                    var popup = L.popup({maxHeight: 225}).setContent(`<h4>${item['name']}</h4> <p>${item['intro']}</p> <img src=${item['images'][0]['source_url']} width="270" height="150">`);
                    marker = L.marker([item['coordinates']['latitude'], item['coordinates']['longitude']], {icon: city}).bindPopup(popup);
                    markers.addLayer(marker);
                    }
                for (let item of result['data']['regions']['results']) {
                    
                    var popup = L.popup({maxHeight: 225}).setContent(`<h4>${item['name']}</h4> <p>${item['intro']}</p> <img src=${item['images'][0]['source_url']} width="270" height="150">`);
                    marker = L.marker([item['coordinates']['latitude'], item['coordinates']['longitude']], {icon: region}).bindPopup(popup);
                    markers.addLayer(marker);
                    }

                for (let item of result['data']['islands']['results']) {
                    var popup = L.popup({maxHeight: 225}).setContent(`<h4>${item['name']}</h4> <p>${item['intro']}</p> <img src=${item['images'][0]['source_url']} width="270" height="150">`);
                    marker = L.marker([item['coordinates']['latitude'], item['coordinates']['longitude']], {icon: island}).bindPopup(popup);
                    markers.addLayer(marker);
                    }

  
             }

        },
        error: function() {
            console.log("Triposo data couldn't be loaded!");
        }
    }); 
}

function getBorders(country, country_iso){
    $.ajax({
        url: "php/getCountriesData.php",
        type: 'POST',
        data: {
            country_iso: country_iso,
            country: country
        },
        success: function (response) {

            
            var result = $.parseJSON(response);
           
            //console.log(result);

            var myStyle = {
                "color": "#224de6",
                "weight": 5,
                "opacity": 0.9
            };

            
            markers.clearLayers();
           

            if(geoson){geoson.clearLayers();}
            geoson = L.geoJSON(result[0], {style:myStyle}).addTo(mymap);
            mymap.fitBounds(geoson.getBounds());

        },
        error: function() {
            console.log("Borders couldn't be loaded!");
        }
    }); 
}



function selectCountry(country, country_iso) {

    //show loading gif
    //$('#loading').show();
    $('#content').hide();

    console.log(country);
    console.log(country_iso);

    getBorders(country, country_iso);
    //getGeneral(country_iso);
    // getTriposo(country_iso);
     //getNews(country);
    //getNobels(country);
     getPhotos(country);
    // getWiki(country);
    // getCorona(country);
    // getCities(country);
    // getYoutube(country);
    // getCamera(country_iso);

    $('#content').show();

    // $.ajax({
    //     url: "php/getCountriesData.php",
    //     type: 'POST',
    //     data: {
    //         country_iso: country_iso,
    //         country: country
    //     },
    //     success: function (response) {

            
    //         var result = $.parseJSON(response);
           
    //         //console.log(result);

    //         var myStyle = {
    //             "color": "#224de6",
    //             "weight": 5,
    //             "opacity": 0.9
    //         };

            
    //         markers.clearLayers();
           

    //         if(geoson){geoson.clearLayers();}
    //         geoson = L.geoJSON(result[0], {style:myStyle}).addTo(mymap);
    //         mymap.fitBounds(geoson.getBounds());

            

             //gettind data from the apis
            // $.ajax({
            //     url: "php/getAPIData.php",
            //     type: 'POST',
            //     dataType: 'json',
            //     data: {
            //         country_iso: country_iso, 
            //         country: country
            //     },
            //     success: function(result) {
        
            //         console.log(result);
                    

            //         if(result.status.name == "ok"){
                        
                    

                        //let rand_photo = Math.floor(Math.random() * 10);
                
        
                        //Restcountries
                        // $('#countryName').html(result['data']['country']["name"]);
                        // $('#capital').html("Capital: " + result['data']['country']["capital"]);
                        // $('#continent').html("Continent: " + result['data']['country']["subregion"]);
                        // $('#population').html("Population: " + nf.format(result['data']['country']["population"]));

                        // var para =  document.getElementById('language');
                        // para.innerHTML = "";
                        // para.innerHTML = "Languages: ";
                        // for (var i = 0; i < result['data']['country']['languages'].length; i++) {
                        //     span = document.createElement('span');
                        //     span.innerText = `| ${result['data']['country']['languages'][i]['name']} | `;
                        //     para.appendChild(span);
                        // }

                        // $('#area').html("Area: " + nf.format(result['data']['country']["area"]) + " km<sup>2</sup>");
                        // $('#currency').html("Currency: " + result['data']['country']["currencies"][0]["name"]);
                        // var currency = result['data']['exchange']['rates'][result['data']['country']["currencies"][0]["code"]];
                        // var fixed = currency.toFixed(2);
                        // $('#exchange').html("One USD is worth "+ fixed +" "+ result['data']['country']["currencies"][0]["code"]);
                        // $('#flagImg').attr({src: result['data']['country']['flag'], style: "width:30px"});
                        // $('#weather').html("Temperature: " + result['data']['weather']['main']['temp'] + "&#8451; " + result['data']['weather']['weather'][0]['description']);
                        // $('#phone').html("Phone prefix: " + result['data']['country']["callingCodes"][0]);
                        // $('#gini').html("Gini coefficient: " + result['data']['country']["gini"]);

                        //Opencage
                        // if(result['data']['opencage']){
                        //     var sunrise = new Date((result['data']['opencage']['results'][0]['annotations']['sun']['rise']['apparent'] + result['data']['opencage']['results'][0]['annotations']['timezone']['offset_sec'])*1000);
                        //     var sunset = new Date((result['data']['opencage']['results'][0]['annotations']['sun']['set']['apparent']+ result['data']['opencage']['results'][0]['annotations']['timezone']['offset_sec'])*1000);
                        // $('#driving').html("Driving on the "+ result['data']['opencage']['results'][0]['annotations']['roadinfo']['drive_on']+" side");
                        // $('#localTime').html("Local date and time is "+ new Date(new Date().getTime() + result['data']['opencage']['results'][0]['annotations']['timezone']['offset_sec']*1000).toString().substr(0,25));
                        // $('#sunrise').html("Sun rises at "+ sunrise.toString().substr(16,8));
                        // $('#sunset').html("Sun sets at "+ sunset.toString().substr(16,8));
                        // }else{
                        //     $('#driving').html("");
                        //     $('#localTime').html("");
                        //     $('#sunrise').html("");
                        //     $('#sunset').html(""); 
                        // }

                        //Nobel
                        // if(result['data']['nobel']['laureates'].length == 0){
                        //     $('#nobel').html("No nobel prize winners.")
                        // }else{
                        // var list3 =  document.getElementById('nobel');
                        //     list3.innerHTML = "";
                        //     for (var i = 0; i < result['data']['nobel']['laureates'].length; i++) {
                        //         li = document.createElement('li');
                        //         li.innerHTML = `${result['data']['nobel']['laureates'][i]['fullName']['en']} in ${result['data']['nobel']['laureates'][i]['nobelPrizes'][0]['awardYear']} for ${result['data']['nobel']['laureates'][i]['nobelPrizes'][0]['category']['en']}`;
                        //         list3.appendChild(li);
                        //     }
                        // }


                        //$('#wiki').html(result['data']['wiki']['extract']);

                        //Unsplash
                        // if(!result['data']['photo']['results'][rand_photo]){
                        //     $('#photoImg').attr({src: result['data']['photo']['results'][rand_photo]['urls']['small']});
                        // }else{
                        //     $('#photoImg').attr({src: result['data']['photo']['results'][0]['urls']['small']});
                        // }

                        //Youtube
                        // if(result['data']['youtube']['items']){
                        //     $('#iframe_1').attr({src: 'https://www.youtube.com/embed/'+ result['data']['youtube']['items'][0]['id']['videoId']});
                        // } else {
                        //     $('#video').html("Video not found");
                        // }

                        //Camera
                        // if(result['data']['camera']['result']['webcams'][0] == undefined){
                        //     $('#camera').html("Camera not found");
                        // } else {
                        //     $('#camLoc').html(result['data']['camera']['result']['webcams'][0]['location']['region']+" - "+result['data']['camera']['result']['webcams'][0]['location']['city']);
                        //     $('#iframe_2').attr({src: result['data']['camera']['result']['webcams'][0]['player']['year']['embed']});
                        // }

                        //Coovid
                        // if(result['data']['covid']["cases"]){
                        // $('#cases').html("Total cases: " + nf.format(result['data']['covid']["cases"]));
                        // $('#recovered').html("Total recovered: " + nf.format(result['data']['covid']["recovered"]));
                        // $('#deaths').html("Total deaths: " + nf.format(result['data']['covid']["deaths"]));
                        // $('#deathsToday').html("Deaths today: " + nf.format(result['data']['covid']["todayDeaths"]));
                        // }else{
                        //     $('#cases').html("Sorry, no data found");
                        //     $('#recovered').html("Sorry, no data found"); 
                        //     $('#deaths').html("Sorry, no data found");
                        //     $('#deathsToday').html("Sorry, no data found");
                        // }

                        //News
                        // var listNews =  document.getElementById('news');
                        // listNews.innerHTML = "";
                        // for(let item of result['data']['news']['articles']){
                        //     if(item['source']['id'] == "reuters" || item['source']['id'] == "bbc-news" || item['source']['id'] == "cnn"){
                        //             li = document.createElement('li'); 
                        //             li.innerHTML = `<img src=${item['urlToImage']} alt="" style="width:280px"></img><br>`;
                        //             li.innerHTML += `<a href="${item['url']}" target='_blank'>${item['title']}</a>`;
                        //             listNews.appendChild(li);
                        //         }

                        // }

                        //Cities
                        // var listCities =  document.getElementById('cities');
                        // listCities.innerHTML = "";
                        // if(result['data']['cities'] && result['data']['cities']['data'].length <= 10){
                            
                        //     for (let item of result['data']['cities']['data']) {
                        //         li = document.createElement('li');
                        //         li.innerHTML = `${item['city']} with ${nf.format(item['populationCounts'][0]['value'])} inhabitants`;
                        //         listCities.appendChild(li);
                        //     }
                        // }else if(result['data']['cities']){
                        //     for(let item of result['data']['cities']['data']){
                        //         if(item['populationCounts'][0]['value']>=300000){
                        //             li = document.createElement('li');
                        //             li.innerHTML = `${item['city']} with ${nf.format(item['populationCounts'][0]['value'])} inhabitants`;
                        //             listCities.appendChild(li);
                        //         }
                        //     }
                        // }

                        //Adding markers

                        // var greenIcon = new L.Icon({
                        //     iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                        //     shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        //     iconSize: [35, 51],
                        //     iconAnchor: [12, 41],
                        //     popupAnchor: [1, -34],
                        //     shadowSize: [41, 41]
                        // });

                        // var goldIcon = new L.Icon({
                        //     iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
                        //     shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        //     iconSize: [20, 33],
                        //     iconAnchor: [12, 41],
                        //     popupAnchor: [1, -34],
                        //     shadowSize: [41, 41]
                        // });

                        // var redIcon = new L.Icon({
                        //     iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                        //     shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        //     iconSize: [20, 33],
                        //     iconAnchor: [12, 41],
                        //     popupAnchor: [1, -34],
                        //     shadowSize: [41, 41]
                        // });

                        // var marker;
                        // if(result['data']['opencage'] != null){
                        //     marker = L.marker([result['data']['opencage']['results'][0]['geometry']['lat'], result['data']['opencage']['results'][0]['geometry']['lng']], {icon: greenIcon}).bindPopup(`This is the capital city, ${result['data']['opencage']['results'][0]['components']['city']}!`);
                        //     markers.addLayer(marker);
                        // }

                        // for (let item of result['data']['attractions']['results']) {
                        //     marker = L.marker([item['coordinates']['latitude'], item['coordinates']['longitude']], {icon: goldIcon}).bindPopup(`Attraction: ${item['name']} <br> ${item['snippet']}`);
                        //     markers.addLayer(marker);
                        //         }

                        // for (let item of result['data']['popularCities']['results']) {
                        //     marker = L.marker([item['coordinates']['latitude'], item['coordinates']['longitude']], {icon: redIcon}).bindPopup(`City: ${item['name']} <br> ${item['snippet']}`);
                        //     markers.addLayer(marker);
                        //     }



                        
                        //hide loading gif
                        //$('#loading').hide();
            //             $('#content').show();
                        
                        
            //         }
  
            //     },
            //     error: function() {
            //         console.log("An error has occured!");
            //     }
            // }); 
        
            //$('#myModal').modal('show');
            //setTimeout(function (){document.getElementById("button_show").style.display = "block"}, 2000);
            
            

    //     },
    // }).fail(function () {});
};


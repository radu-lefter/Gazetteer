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


//Populate the select list

let dropdown = $('#countryDropdown');

dropdown.empty();

dropdown.append('<option selected="true" value="dummy" disabled>Choose country</option>');
dropdown.prop('selectedIndex', 0);


$.ajax({
        type: 'GET',
        url: "php/getCountriesNames.php",
        success: function (response) {

            var output = $.parseJSON(response);
            

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
    
    $.ajax({
        
        url: "php/getUserCountry.php",
        type: 'POST',
        data: {
            latitude: crd.latitude,
            longitude: crd.longitude
        },
        success: function (response) {
    
    
            if(response){
                selectCountry(response["data"]["results"][0]["components"]["country"], response["data"]["results"][0]["components"]["ISO_3166-1_alpha-2"]);
            }
           
           
        },
    }).fail(function () {
        console.log("Error encountered!")
    });
}


if (window.navigator.geolocation) {
    window.navigator.geolocation.getCurrentPosition(getCoords, console.log);

   } 


//Add the map layer

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
}).addTo(mymap);



//Add interactivity on select
$('#countryDropdown').change(function(){
    let country = $('select option:selected').text();
    let country_iso = $('select option:selected').val();
    selectCountry(country, country_iso);
    
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

            //console.log(result);

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

            //console.log(result);

            if(result.status.name == "ok"){

                var nobelTable =  document.getElementById('nobelTable');
                nobelTable.innerHTML = "";

                if(result['data']['laureates'].length == 0){
                    $('#nobelTable').html(`<tr><td>No nobel prize winners.</td><td></td><td></td></tr>`)
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

            //console.log(result);

            if(result.status.name == "ok"){

                var photosTable =  document.getElementById('photosTable');
                photosTable.innerHTML = "";
                var div1 = document.createElement('div');
                div1.className ="column";
                var div2 = document.createElement('div');
                div2.className ="column";

                for(let i = 0; i<result['data']['results'].length; i+=2){
                    let second = i+1;
                     
                    div1.innerHTML += `<img src=${result['data']['results'][i]['urls']['small']} alt=""></img>`;
                    
                    
                    div2.innerHTML += `<img src=${result['data']['results'][second]['urls']['small']} alt=""></img>`;
                   
                    
                }

                photosTable.appendChild(div1);
                photosTable.appendChild(div2);

  
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

            //console.log(result);

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

            //console.log(result);

            if(result.status.name == "ok"){

                if(result['data']["cases"]){
                    $('#covidCountry').html(`Covid statistics for ${result['data']["country"]}`);
                    $('#cases').html(nf.format(result['data']["cases"]));
                    $('#recovered').html(nf.format(result['data']["recovered"]));
                    $('#deaths').html(nf.format(result['data']["deaths"]));
                    $('#deathsToday').html(nf.format(result['data']["todayDeaths"]));
                    $('#recoveredToday').html(nf.format(result['data']["todayRecovered"]));
                    $('#casesToday').html(nf.format(result['data']["todayCases"]));
                    $('#activeCases').html(nf.format(result['data']["active"]));
                    }else{
                        $('#covidTable').html(`<p>No data found for Covid cases.</p>`)
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

            //console.log(result);

            if(result.status.name == "ok"){

                var citiesTable =  document.getElementById('citiesTable');
                citiesTable.innerHTML = "";
                        if(result['data']){

                            let data = [];
                            for (let item of result['data']['data']) {
                                data.push({"city":item['city'], "population": item['populationCounts'][0]['value']});
                            }

                            data.sort((a, b) => parseFloat(b.population) - parseFloat(a.population));

                            if(data.length == 0){
                                $('#citiesTable').html(`<tr>No data for this country's cities.</tr>`)
                            }else{
                                for (var i in data) {
                               
                                    tr = document.createElement('tr'); 

                                    td = document.createElement('td'); 
                                    td.innerHTML = data[i]['city'];
                                    tr.appendChild(td);
                                    
                                    td = document.createElement('td'); 
                                    td.innerHTML = nf.format(data[i]['population']);
                                    tr.appendChild(td);
                                     
                                    citiesTable.appendChild(tr);
            
                                
                            }

                        
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

            //console.log(result);

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

            //console.log(result);

            if(result['data']['result']['webcams'][0] == undefined){
                $('#camera').html("<p>Sorry, camera not available at the moment.</p>");
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

            //console.log(result);

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

            //console.log(result);

            if(result.status.name == "ok"){

                var myIcon = L.Icon.extend({
                    options: {
                        
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

    getBorders(country, country_iso);
    getGeneral(country_iso);
    getTriposo(country_iso);
    getNews(country);
    getNobels(country);
    getPhotos(country);
    getWiki(country);
    getCorona(country);
    getCities(country);
    getYoutube(country);
    getCamera(country_iso);


};


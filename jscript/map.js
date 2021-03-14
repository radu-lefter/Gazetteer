
//populate the select list

let dropdown = $('#countryDropdown');

dropdown.empty();

dropdown.append('<option selected="true" value="dummy" disabled>Choose country</option>');
dropdown.prop('selectedIndex', 0);


//let countries = [];

    // $.ajax({
    //     dataType: "json",
    //     url: "php/getCountriesData.php",
    //     success: function (data) {

            
    //             $.each(data.features, function (key, country) {
    //                 countries.push({"name": country.properties.name, "iso": country.properties.iso_a3}) 
    //             })
                
    //             countries.sort((a, b) => (a.name > b.name) ? 1 : -1);

    //              for (let item of countries) {
    //                 dropdown.append($('<option></option>').attr('value', item.iso).text(item.name));
    //             }
           
    //     },
    // }).fail(function () {});

$.ajax({
        //dataType: "json",
        type: 'GET',
        url: "php/getCountriesData.php",
        success: function (response) {

            var output = $.parseJSON(response);
            console.log(output);

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

function selectCountry(country, country_iso) {


    console.log(country);
    console.log(country_iso);
    $.ajax({
        //dataType: "json",
        url: "php/getCountriesBorders.php",
        success: function (response) {

            var output = $.parseJSON(response);
            console.log(output);

            var result = output.filter(obj => {
                       return obj.properties.iso_a2 === country_iso;
                  });

            var myStyle = {
                "color": "#224de6",
                "weight": 5,
                "opacity": 0.9
            };


            if(geoson){geoson.clearLayers();}
            geoson = L.geoJSON(result, {style: myStyle}).addTo(mymap);
            mymap.fitBounds(geoson.getBounds());


    
             
            $.ajax({
                url: "php/getAPIData.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    country_iso: country_iso, 
                    country: country
                },
                success: function(result) {
        
                    console.log(result);
        
                    if (result.status.name == "ok") {

                        let rand_photo = Math.floor(Math.random() * 10);
                        let rand_news1 = Math.floor(Math.random() * 20);
                        let rand_news2 = Math.floor(Math.random() * 20);
                        let rand_news3 = Math.floor(Math.random() * 20);
        
                        $('#countryName').html(result['data']['country']["name"]);
                        $('#capital').html("Capital: " + result['data']['country']["capital"]);
                        $('#continent').html("Continent: " + result['data']['country']["subregion"]);
                        $('#population').html("Population: " + result['data']['country']["population"]);
                        $('#language').html("Language: " + result['data']['country']["languages"][0]["name"]);
                        $('#currency').html("Currency: " + result['data']['country']["currencies"][0]["name"]);
                        $('#flagImg').attr({src: result['data']['country']['flag'], style: "width:30px"});
                        $('#wiki').html(result['data']['wiki']['extract']);
                        $('#photoImg').attr({src: result['data']['photo']['results'][rand_photo]['urls']['small']});
                        $('#news1').attr({href: result['data']['news']['articles'][rand_news1]['url']});
                        $('#news1').html(result['data']['news']['articles'][rand_news1]['title']);
                        $('#news2').attr({href: result['data']['news']['articles'][rand_news2]['url']});
                        $('#news2').html(result['data']['news']['articles'][rand_news2]['title']);
                        $('#news3').attr({href: result['data']['news']['articles'][rand_news3]['url']});
                        $('#news3').html(result['data']['news']['articles'][rand_news3]['title']);
                        if(result['data']['youtube']['items']){
                            $('#iframe').attr({src: 'https://www.youtube.com/embed/'+ result['data']['youtube']['items'][0]['id']['videoId']});
                        } else {
                            $('#video').html("Video not found");
                        }
                        if(result['data']['covid']["cases"]){
                        $('#cases').html("Total cases: " + result['data']['covid']["cases"]);
                        $('#recovered').html("Total recovered: " + result['data']['covid']["recovered"]);
                        $('#deaths').html("Total deaths: " + result['data']['covid']["deaths"]);
                        $('#deathsToday').html("Deaths today: " + result['data']['covid']["todayDeaths"]);
                        }else{
                            $('#cases').html("Sorry, no data found");
                            $('#recovered').html("Sorry, no data found"); 
                            $('#deaths').html("Sorry, no data found");
                            $('#deathsToday').html("Sorry, no data found");
                        }
                    }
        
                    
                
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    // your error code
                    console.log("An error has occured!");
                }
            }); 
        
            $('#myModal').modal('show');
            
        },
    }).fail(function () {});
};



//alternative of having every country clickable

// $.ajax({
//     dataType: "json",
//     url: "countryBorders.geo.json",
//     success: function (data) {
//         //console.log(data);
//         L.geoJson(data).addTo(mymap);


//         var geojson;
        
//         function highlightFeature(e) {
//             var layer = e.target;
        
//             layer.setStyle({
//                 weight: 5,
//                 color: '#f4c324',
//                 dashArray: '',
//                 fillOpacity: 0.1
//             });
        
//             if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
//                 layer.bringToFront();
//             }
//         }
        
//         function resetHighlight(e) {
//             geojson.resetStyle(e.target);
//         }
        
//         function getCountryInfo(e) {
//             mymap.fitBounds(e.target.getBounds()); // zoom to feature
//             console.log(e.target);
           

//             //populate modal with country info
//             $.ajax({
//                 url: "jscript/api.php",
//                 type: 'POST',
//                 dataType: 'json',
//                 data: {
//                     country: e.target.feature.properties.iso_a3
//                 },
//                 success: function(result) {
    
//                     //console.log(result);
    
//                     if (result.status.name == "ok") {
    
//                         $('#countryName').html(result['data']["name"]);
//                         $('#capital').html("Capital: " + result['data']["capital"]);
//                         $('#continent').html("Continent: " + result['data']["subregion"]);
//                         $('#population').html("Population: " + result['data']["population"]);
//                         $('#language').html("Language: " + result['data']["languages"][0]["name"]);
//                         $('#currency').html("Currency: " + result['data']["currencies"][0]["name"]);
//                         $('#flagImg').attr({src: result['data']['flag'], style: "width:30px"});
                        
                        
//                     }
                
//                 },
//                 error: function(jqXHR, textStatus, errorThrown) {
//                     // your error code
//                     console.log("An error has occured!");
//                 }
//             }); 

        

//             $('#myModal').modal('show');

//         }

        

        
//         function onEachFeature(feature, layer) {
//             layer.on({
//                 mouseover: highlightFeature,
//                 mouseout: resetHighlight,
//                 click: getCountryInfo
                
//             });
//         }
        
//         geojson = L.geoJson(data, {
//             onEachFeature: onEachFeature
//         }).addTo(mymap);
//     },
//   }).fail(function () {});

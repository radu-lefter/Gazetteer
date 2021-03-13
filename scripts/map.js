
//populate the select list

let dropdown = $('#countryDropdown');

dropdown.empty();

dropdown.append('<option selected="true" value="dummy" disabled>Choose country</option>');
dropdown.prop('selectedIndex', 0);


let countries = [];

    $.ajax({
        dataType: "json",
        url: "countryBorders.geo.json",
        success: function (data) {

            
                $.each(data.features, function (key, country) {
                    countries.push({"name": country.properties.name, "iso": country.properties.iso_a3}) 
                })
                
                countries.sort((a, b) => (a.name > b.name) ? 1 : -1);

                 for (let item of countries) {
                    dropdown.append($('<option></option>').attr('value', item.iso).text(item.name));
                }
           
        },
    }).fail(function () {});


    



//create the map
//middle of world [40.0022, 78.4558]

var lat = 40.0022;
var long = 78.4558;

var mymap = L.map('mapId').fitWorld();

mymap.locate({setView: true, maxZoom: 5});



//get coordinates of the user
// navigator.geolocation.getCurrentPosition(showPosition);


// function showPosition(position) {
//     console.log(position.coords.latitude);
//     console.log(position.coords.longitude);
//     lat=position.coords.latitude;
//     long=position.coords.longitude;

//     mymap.setView([lat, long], 4);
// }

  


L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(mymap);




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
        dataType: "json",
        url: "countryBorders.geo.json",
        success: function (data) {

            var result = data.features.filter(obj => {
                       return obj.properties.iso_a3 === country_iso;
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
                url: "scripts/curl.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    country_iso: country_iso, 
                    country: country
                },
                success: function(result) {
        
                    console.log(result);
        
                    if (result.status.name == "ok") {

                        let rand = Math.floor(Math.random() * 10);
        
                        $('#countryName').html(result['data']['country']["name"]);
                        $('#capital').html("Capital: " + result['data']['country']["capital"]);
                        $('#continent').html("Continent: " + result['data']['country']["subregion"]);
                        $('#population').html("Population: " + result['data']['country']["population"]);
                        $('#language').html("Language: " + result['data']['country']["languages"][0]["name"]);
                        $('#currency').html("Currency: " + result['data']['country']["currencies"][0]["name"]);
                        $('#flagImg').attr({src: result['data']['country']['flag'], style: "width:30px"});
                        $('#wiki').html(result['data']['wiki']['extract']);
                        $('#photoImg').attr({src: result['data']['photo']['results'][rand]['urls']['small']});
                        $('#news1').attr({href: result['data']['news']['articles'][4]['url']});
                        $('#news1').html(result['data']['news']['articles'][4]['description']);
                        $('#news2').attr({href: result['data']['news']['articles'][7]['url']});
                        $('#news2').html(result['data']['news']['articles'][7]['description']);
                        $('#news3').attr({href: result['data']['news']['articles'][10]['url']});
                        $('#news3').html(result['data']['news']['articles'][10]['description']);
                        $('#iframe').attr({src: 'https://www.youtube.com/embed/'+ result['data']['youtube']['items'][0]['id']['videoId']});
                        $('#cases').html("Total cases: " + result['data']['covid']["cases"]);
                        $('#recovered').html("Total recovered: " + result['data']['covid']["recovered"]);
                        $('#deaths').html("Total deaths: " + result['data']['covid']["deaths"]);
                        $('#deathsToday').html("Deaths today: " + result['data']['covid']["todayDeaths"]);

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
//                 url: "scripts/api.php",
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

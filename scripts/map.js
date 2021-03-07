
//get user location
navigator.geolocation.getCurrentPosition(showPosition);
function showPosition(position) {
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
    
  }



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
var mymap = L.map('mapId').setView([51.505, -0.09], 4);

L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(mymap);


//submit button

var selected = $('select option:selected').val();


var aBtn = document.getElementById("selectButton");
aBtn.onclick=function(){
    selected = $('select option:selected').val();
    selectCountry(selected);
};


//Adding border around each country and fetching data

var geoson;

function selectCountry(selected) {
    $.ajax({
        dataType: "json",
        url: "countryBorders.geo.json",
        success: function (data) {

            var result = data.features.filter(obj => {
                       return obj.properties.iso_a3 === selected;
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
                url: "scripts/api.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    country: selected
                },
                success: function(result) {
        
                    //console.log(result);
        
                    if (result.status.name == "ok") {
        
                        $('#countryName').html(result['data']["name"]);
                        $('#capital').html("Capital: " + result['data']["capital"]);
                        $('#continent').html("Continent: " + result['data']["subregion"]);
                        $('#population').html("Population: " + result['data']["population"]);
                        $('#language').html("Language: " + result['data']["languages"][0]["name"]);
                        $('#currency').html("Currency: " + result['data']["currencies"][0]["name"]);
                        $('#flagImg').attr({src: result['data']['flag'], style: "width:30px"});
        
                        

                   
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

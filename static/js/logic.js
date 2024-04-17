let myMap = L.map("map", {
    center: [37.09,-95.71],
    zoom: 5
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

let baseURL ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
console.log(baseURL);


d3.json(baseURL).then(function(response) {

    //console.log(response);
    features = response.features;
  
    //console.log(features);
  
    // Comment this line in to render all 80,000 markers
    // let marker_limit = features.length;
    let marker_limit = 1000;
  function getRadius(radius){
    return radius*3;
  }
  function getColor(depth) {
   
    if (depth < 10) {
      return "yellow";
    } else if (depth < 30) {
        return "green"; 
      } else if (depth < 50) {
        return "orange"; 
      } else if (depth < 70) {
        return "blue"; 
      } else if (depth < 90) {
        return "red"; 
      } else {
      return "black";
    }
  }
 
    for (let i = 0; i < features.length; i++) {
        

        var geoMarkers = {
            radius:getRadius (features[i].properties.mag),
            fillColor:getColor(features[i].geometry.coordinates[2]),
            fillOpacity: 0.30,
            stroke: true,
            weight: 1
          }
      let location = features[i].geometry;
      if(location){
       // L.marker([location.coordinates[1], location.coordinates[0]]).addTo(myMap);
        L.circleMarker([location.coordinates[1], location.coordinates[0]], geoMarkers) .bindPopup(`<h3>Location:</h3> ${features[i].properties.place}<h3> Magnitude:</h3> ${features[i].properties.mag}<h3> Depth:</h3> ${features[i].geometry.coordinates[2]}`).addTo(myMap);
      }
  
    }
  });
  let legend = L.control({ position: 'bottomright' });

  legend.onAdd = function() {
      let div = L.DomUtil.create('div', 'info legend');
      let colors = ["yellow", "green", "orange", "blue", "red", "black"];
      let labels = ['0-10', '10-30', '30-50', '50-70', '70-90', '90+'];
  
      div.innerHTML += '<h4>Depth Legend</h4>';
  
      for (let i = 0; i < colors.length; i++) {
          div.innerHTML +=
          '<i style="background:' + colors[i] + '"></i> ' +
          labels[i] + '<br>';
      }
  
      return div;
  };
  
  legend.addTo(myMap);
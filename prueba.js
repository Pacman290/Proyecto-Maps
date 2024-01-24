let autocompleteOrigin;
let autocompleteDestination;
let service;

function iniciar(){
  document.getElementById("enviarLocalidades").addEventListener("click", mostrarDistanciaTiempo, false);
  autocompleteOrigin = new google.maps.places.Autocomplete(
  document.getElementById("origenInput"),
  {
    fields:['place_id', 'geometry', 'name']
  });
  autocompleteDestination = new google.maps.places.Autocomplete(
    document.getElementById("destinoInput"),
    {
      fields:['place_id', 'geometry', 'name']
    });
  service = new google.maps.DistanceMatrixService();
}


function mostrarDistanciaTiempo(){
    const options ={
      departureTime: new Date,
      //trafficModel: 'optimistic'
      //trafficModel: 'pessimistic'
    }
  const origen = autocompleteOrigin.getPlace().geometry.location;
  const destino = autocompleteDestination.getPlace().geometry.location;
  service.getDistanceMatrix(
    {
      origins: [origen],
      destinations: [destino],
      travelMode: 'DRIVING',
      drivingOptions: options,
    }, callback);
}

function callback(response, status) {
  if (status == 'OK') {
    const origins = response.originAddresses;
    const destinations = response.destinationAddresses;
    let results;
    let element;
    for (let i = 0; i < origins.length; i++) {
      results = response.rows[i].elements;
      for (let j = 0; j < results.length; j++) {
        element = results[j];
        document.getElementById("distancia").innerHTML= element.distance.text;
        document.getElementById("tiempo").innerHTML=element.duration_in_traffic.text;
        document.getElementById("origen").innerHTML= origins[i];
        document.getElementById("destino").innerHTML= destinations[j];
      }
    }
  }
}
let autocompleteOrigin;
let autocompleteDestination;
let service;
let trafico = 'bestguess';

function iniciar(){
  document.getElementById("enviarLocalidades").addEventListener("click", consultarDistanciaTiempo, false);
  document.getElementById("fechaYHora").min= fechaActualFormateada();
  //cambia el valor del trafico segun el elemento seleccionado del input radio
  const traficoOptimista= document.getElementById("traficoOptimista");
  const traficoNormal= document.getElementById("traficoNormal");
  const traficoPesimista= document.getElementById("traficoPesimista");
  traficoOptimista.addEventListener("click", ()=> cambiarTrafico(traficoOptimista.value), false);
  traficoNormal.addEventListener("click", ()=> cambiarTrafico(traficoNormal.value), false);
  traficoPesimista.addEventListener("click", ()=> cambiarTrafico(traficoPesimista.value), false);
  // Inicializa los autocompletados de Google Maps
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

function cambiarTrafico(traficoSeleccionado){
  trafico= traficoSeleccionado;
}


function consultarDistanciaTiempo(){
  const options ={
    departureTime: getFechaUsuario(),
    trafficModel: trafico
  }
  // chequea que los campos estén completos
  if (!autocompleteOrigin.getPlace() || !autocompleteDestination.getPlace()) {
    alert('Falta ingresar origen o destino');
    return;
  }
  const origen = autocompleteOrigin.getPlace().geometry.location;
  const destino = autocompleteDestination.getPlace().geometry.location;
  service.getDistanceMatrix(
    {
      origins: [origen],
      destinations: [destino],
      travelMode: 'DRIVING',
      drivingOptions: options,
    }, mostrarResultado);
}

function mostrarResultado(response, status) {
  if (status == 'OK') {
    //procesa y muestra los resultados
    const origins = response.originAddresses;
    const destinations = response.destinationAddresses;
    const results = response.rows[0].elements;
    const element = results[0];
    document.getElementById("distancia").innerHTML= element.distance.text;
    document.getElementById("tiempo").innerHTML=element.duration_in_traffic.text;
    document.getElementById("origen").innerHTML= origins[0];
    document.getElementById("destino").innerHTML= destinations[0];
  } else{
    console.log('hubo un problema en la consulta');
  }
}

function fechaActualFormateada(){
  const date= new Date();
  return ""+date.getFullYear()+ "-"+ _getMonth(date)+"-"+_getDate(date)+"T"+_getHours(date)+":"+_getMinutes(date);
}

function _getMonth(date){
  const mes= date.getMonth();
  if(mes<9){
    return "0"+(mes+1);
  }
  return (mes+1);
}

function _getDate(date){
  const dia= date.getDate();
  if(dia<10){
    return "0"+dia;
  }
  return dia;
}

function _getHours(date){
  const hora= date.getHours();
  if(hora<10){
    return "0"+hora;
  }
  return hora;
}


function _getMinutes(date){
  const minutos= date.getMinutes();
  if(minutos<10){
    return "0"+minutos;
  }
  return minutos;
}

function getFechaUsuario(){
  const fecha = document.getElementById("fechaYHora").value;
  return new Date(fecha);
}
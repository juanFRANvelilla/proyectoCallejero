const enunciado = document.getElementById("enunciado");
const alternativa1 = document.getElementById("alternativa1");
const alternativa2 = document.getElementById("alternativa2");
const alternativa3 = document.getElementById("alternativa3");
const numeroPreguntaID = document.getElementById("numero-pregunta");
const contenedorResultado = document.getElementById("contenedorRespuestas");
const resultado = document.getElementById("resultado");
const reiniciar = document.getElementById("reiniciar");
reiniciar.style.display = "none";
let resultadoPreguntas = "";
let correccion = [];
let clickOpcion = document.querySelectorAll(".alternativa");
let opcionElegida = null;

for (let i = 0; i < clickOpcion.length; i++){
    clickOpcion[i].addEventListener("click", function() {
        if (opcionElegida) {
            opcionElegida.classList.remove("opcionElegida");
            
        }
        this.classList.add("opcionElegida");
        opcionElegida = this;
      });
    }


let numeroPregunta = 1;
let aciertos = 0;
let fallos = 0;
let respuestaCorrecta;
//vector que almacena todos los origenes para no haya 2 preguntas con el mismo
let origenes = [];
realizarPeticion();

//devuelve un string con el nombre de las calles de un recorrido
function nombreCallesRecorrido(recorrido,data){
    let nombreCalles = [];
    recorrido.forEach(function (valor){
        nombreCalles.push(data[valor].nombre);
    })
    return nombreCalles;
}

//comprueba si dos recorridos son iguales
function sonRecorridosIguales(recorrido1, recorrido2){
    if (recorrido1.length != recorrido2.length){
        return false;
    }
    for (let i = 0; i < recorrido1.length; i++){
        if (recorrido1[i] != recorrido2[i]){
            return false;
        }
    }
    return true;
}

//primera funcion con la que carga el .json y crea un recorrido aleatorio válido y sus 2 alernativas
async function realizarPeticion() {
    const res = await fetch('static/json/listaCalles.json');
    const data = await res.json();

    //se crea un recorrido aleatorio y optimo
    let recorrido = crearRecorrido(data);
    origenes.push(recorrido[0]);

    //crea 2 alternativas teniendo como origen el recorrido valido
    let recorridoAlternativa;
    let recorridoAlternativa2;
    alternativaValida = false;
    while(!alternativaValida){ 
        recorridoAlternativa = crearCopiaRecorrido(recorrido);
        recorridoAlternativa2 = crearCopiaRecorrido(recorrido);
        recorridoAlternativa = crearAlternativa(data, recorridoAlternativa);
        recorridoAlternativa2 = crearAlternativa(data, recorridoAlternativa2);
        console.log ("\nrecorrido correcto: " + recorrido)
        console.log ("recorrido alternativa 1: " + recorridoAlternativa)
        console.log ("recorrido alternativa 2: " + recorridoAlternativa2)
        console.log("Origenes: ", origenes);
        if (!sonRecorridosIguales(recorridoAlternativa, recorridoAlternativa2) && !sonRecorridosIguales(recorrido, recorridoAlternativa2) && !sonRecorridosIguales(recorrido, recorridoAlternativa)){
            alternativaValida = true;
        }
    } 
    
       
    let nombreRecorridoCorrecto = nombreCallesRecorrido(recorrido, data);
    let nombreRecorridoAlternativa = nombreCallesRecorrido(recorridoAlternativa,data)
    let nombreRecorridoAlternativa2 = nombreCallesRecorrido(recorridoAlternativa2,data)
    
    //enunciado de la pregunta en la que sacara por pantalla el origen y destino
    let nombreOrigen = data[recorrido[0]].nombre
    let nombreDestino = data[recorrido[recorrido.length-1]].nombre
    let fraseEnunciado = nombreOrigen + " — " + nombreDestino;
    enunciado.innerHTML = fraseEnunciado;
    numeroPreguntaID.innerHTML = numeroPregunta;

    //al terminar el cuestionario se mostrara el total de preguntas y su respuesta correspondiente  
	//con este metodo añadimos pregunta a pregunta el resultado
    añadirResultadoPreguntas(nombreRecorridoCorrecto, fraseEnunciado, numeroPregunta);
	//mas tarde al comprobar la alternativa seleccionada indicara si has acertado, fallado o no contestado
    

    //selecciona el orden en el que van a presentarse las diferentes alternativas de la pregunta para que el orden varie
    seleccionarOrden(nombreRecorridoCorrecto,nombreRecorridoAlternativa,nombreRecorridoAlternativa2);
    
    
    console.log("\nPREGUNTA NUMERO: ", numeroPregunta);
    console.log("la respuesta correcta es: ", respuestaCorrecta);
    console.log(nombreRecorridoCorrecto);
    console.log("numero aciertos: ", aciertos);
    console.log("numero fallos: ", fallos);
    
}

//asigna una posicion aleatoria del 1 al 3 al recorrido valido y alternativas, asigna a la variable global "respuestaCorrecta"
//la "posicionA" que es la correspondiente a la alternativa correcta
function seleccionarOrden(nombreRecorridoCorrecto,nombreRecorridoAlternativa,nombreRecorridoAlternativa2){
    posicionA = Math.floor(Math.random() * (3) + 1);
    respuestaCorrecta = posicionA;
    mostrarPorPantalla(posicionA, nombreRecorridoCorrecto);

    let posicionB = 0;
    do{
        posicionB = Math.floor(Math.random() * (3) + 1);

    }
    while (posicionB == posicionA)
    mostrarPorPantalla(posicionB, nombreRecorridoAlternativa);

    let posicionC=0;
    do{
        posicionC = Math.floor(Math.random() * (3) + 1);

    }
    while (posicionC == posicionA || posicionC == posicionB);
    mostrarPorPantalla(posicionC, nombreRecorridoAlternativa2);
}

//funcion que se encarga de mostrar con .innerHTML las alternativas de la pregunta dependiendo de su orden
function mostrarPorPantalla(posicion, recorrido){
    if (posicion == 1){
        alternativa1.innerHTML = recorrido;
    }
    else if (posicion == 2){
        alternativa2.innerHTML = recorrido;
    }
    else if (posicion == 3){
        alternativa3.innerHTML = recorrido;
    }
}


//crea un recorrido utilizando 2 funciones, una crea un recorrido aleatorio y la otra comprueba que este recorrido es optimo
function crearRecorrido(data) {
    let recorridoValido = false;
    while (!recorridoValido) {
        var recorrido = crearRecorridoAleatorio(data);
        console.log("\nEl recorrido aleatorio: " + recorrido);
        recorridoValido = esRecorridoOptimo(recorrido, data);
        console.log("El recorrido es valido? " + recorridoValido)

    }
    return recorrido;
}

//crea un recorrido aleatorio desde un origen aleatorio con una profundidad (numero de calles recorridas) variable y con 
// la condicion de que no se repita ninguna calle
function crearRecorridoAleatorio(data){
    let profundidad = Math.floor(Math.random() * (6-3) + 4);
    let contadorCalles = 1;
    let origen;
    do {
        origen = Math.floor(Math.random() * data.length); 
    }
    //origen no validos: 8, 9, 17, 20, 23, y los origenes de las preguntas anteriores
    while (origen == 8 || origen == 9 || origen == 17 || origen == 20 || origen == 23 || calleRepetida(origenes, origen));

    let recorrido = [origen];
    let conexion;
    //conexion se refiere a la calle de la que proviene, ya que dependiendo de esta tendras unas salidas u otras
    while(profundidad !== contadorCalles){
        for (let i = 1; i < profundidad; i++){
            if (contadorCalles == 1){
                conexion = 0;
                //en el caso de que estemos en la calle origen, la conexion se establece por defecto en 0, debido a que en la mayoria
                //de las calles del .json la conexion 0 es aquella que dispone de mas cantidad de salidas
            }
            else{
                let numConexiones = data[recorrido[recorrido.length-1]].conexion.length;
                let calleBuscarConexion = data[recorrido[recorrido.length-1]].id
                let calleAnteriorBuscarConexion = data[recorrido[recorrido.length-2]].id    
                conexion = elegirConexion(calleBuscarConexion, calleAnteriorBuscarConexion, data, numConexiones)
                //cuando tomamos como referencia una calle que no sea el origen es necesario saber cual es la calle de procedencia para
                //poder elegir las salidas disponibles

            }
            let numSalidas = data[recorrido[recorrido.length-1]].conexion[conexion].salidas.length;
            //en el caso que nos topemos con una calle que no tenga salidas dependiendo de la calle por la que entras se cancelara el recorrido
            //y sera necesario que se cree otro de nuevo
            if (numSalidas == 0){
                recorrido = [origen];
                contadorCalles = 1;
                break;

            }
            let salidaAleatoria = Math.floor(Math.random() * numSalidas);
            let salidaElegida = data[recorrido[recorrido.length-1]].conexion[conexion].salidas[salidaAleatoria];
            //si una calle del recorrido se repite el recorrido sera cancelado y habra que crear otro
            if(calleRepetida(recorrido,salidaElegida)){
                recorrido = [origen];
                contadorCalles = 1;
                break;

            }
            recorrido.push(salidaElegida);
            contadorCalles++;

        }
        

    }
    return recorrido;

}

//comprueba que el recorrido generado aleatoriamente es optimo, es decir, que no existe un recorrido 
//con menos calles recorridas para ir de origen a destino 
function esRecorridoOptimo(recorrido,data){
    let recorridoValido = false;
    let origen = recorrido[0];
    let destino = recorrido[recorrido.length-1];
    let calleEncontrada = false;
    let profundidad = 1;
    let contador = crearContador(profundidad);
    //profundidadRef es el numero de calles recorridas por el recorrido aleatorio para ir de origen a destino
    let profundidadRef = recorrido.length - 1;
    let conexion = 0;
    let modificarContador = false;

    while (profundidad < profundidadRef && !calleEncontrada){
        let conexiones = [];
        recorrido = [origen];
        if (modificarContador){
            contador = crearContador(profundidad);
            modificarContador = false;
        }

        for (let i=0; i < profundidad; i++){
            if (i == 0){
                let conexion = 0;
                recorrido.push(data[recorrido[recorrido.length-1]].conexion[conexion].salidas[contador[i]]);
                conexiones.push(conexion);
            }
            else{
                let numConexiones = data[recorrido[recorrido.length-1]].conexion.length;
                let calleBuscarConexion = data[recorrido[recorrido.length-1]].id
                let calleAnteriorBuscarConexion = data[recorrido[recorrido.length-2]].id 
                conexion = elegirConexion(calleBuscarConexion, calleAnteriorBuscarConexion, data,numConexiones);
                conexiones.push(conexion);
                if (data[recorrido[recorrido.length-1]].conexion[conexion].salidas.length != 0){
                    recorrido.push(data[recorrido[recorrido.length-1]].conexion[conexion].salidas[contador[i]]);
                }
                else{
                    buscarCalle = false;
                }
            }
        }

        //si encuentra la calle destino con menos profundidad que el recorrido aleatorio significa que este no es optimo
        if (recorrido[recorrido.length-1] == destino){
            calleEncontrada = true;
            break;
        }
        else{
            for (let i = recorrido.length-2; i > -1; i--){
                contador[i] += 1;
                if (i != 0){
                    if (contador[i] == data[recorrido[i]].conexion[conexiones[i]].salidas.length){
                        contador[i] = 0;
                    }
                    else{
                        break;
                    }
                }
                else{
                    if (contador[0] == data[recorrido[i]].conexion[conexiones[0]].salidas.length){
                        contador[0] = 0;
                        modificarContador = true;
                        profundidad += 1;
                    }
                    else{
                        break;
                    }
                }
            }
        }
    }
    //si no encuentra la calle destino con menos calles recorridas el recorrido aleatorio es optimo
    if (!calleEncontrada){
        recorridoValido = true;
    }
    return recorridoValido;
}

//elige la conexion teniendo en cuenta la calle de la que procede
function elegirConexion(calle, calleAnterior, data, numConexiones){
    for (let i = 0; i < numConexiones;i++){
        let numEntradas = data[calle].conexion[i].entrada.length;
        for (let j = 0; j < numEntradas; j++){
            if (data[calle].conexion[i].entrada[j] == calleAnterior){
                return i;
            }
        }
    }
}

//funcion booleana que comprueba si una calla se encuentra en el vector
//se utiliza para comprobar que al añadir calles esta no se encontrara ya en el recorrido
//y tambien para asegurarse que el origen de una pregunta no se repite en otra
function calleRepetida(vector, calle){
    for (let i = 0; i < vector.length; i++){
        if(vector[i] == calle){
            return true;
        }
    }
    return false;
}

//crea el contador teniendo el cuenta la profundidad, se emplea para recorrer todas las calles desde el origen y
//comprobar si se puede llegar a la calle destino con menos profundidad que la del recorrido aleatorio
function crearContador(profundidad){
    let contador = [];
    for(let i=0; i < profundidad; i++){
        contador.push(0);
    }
    return contador;
}

//crea la alternativa al recorrido correcto realizando modificaciones
function crearAlternativa(data, recorrido){
    let tipoModificacion = Math.floor(Math.random() * 4);
    console.log("\nTIPO MODIFICACION " + tipoModificacion)
    switch (tipoModificacion){
        case 0:
            recorrido = suprimirCalle(recorrido);
            break;
        case 1:
            recorrido = cambiarCalle(data, recorrido);
            break;
        case 2:
            recorrido = cambiarOrden(recorrido);
            break;
        case 3:
            recorrido = añadirCalle(data, recorrido);
            break;
    }  
    return recorrido;
}



//modificacion que consiste en suprimir una calle del recorrido que no sea el origen ni el destino
function suprimirCalle(recorrido){
    console.log("El recorrido original: " + recorrido)
    let longitudRecorrido = recorrido.length;
    let posicionCalleEliminar = Math.floor(Math.random()*(longitudRecorrido-2) + 1);
    let calleEliminar = recorrido[posicionCalleEliminar];
    recorrido = recorrido.filter(value => {return value != calleEliminar});
    console.log("El recorrido recortado: " + recorrido)
    return recorrido;
}

//modificacion que cambia una calle del recorrido que no sea el origen ni el destino, consiste en cambiar la salida
//de una calle del recorrido teniendo en cuenta de donde procede (conexion)
function cambiarCalle(data, recorrido){
    console.log("recorrido original: ", recorrido)
    let calleDiferente = false;

    while (!calleDiferente){
        let calleCambiada = 0;
        let posicionCalleCambiar = Math.floor(Math.random() * (recorrido.length-2)) + 1;
        let calleNoCambiada = recorrido[posicionCalleCambiar];
        let calleDondeBuscoNuevaSalida = data[recorrido[posicionCalleCambiar - 1]].id;
        //si quieres cambiar la calle 1 tendras que elegir otra salida de la calle 0 (calle origen) y la conexion utilizada
        //por defecto sera 0, ya que la calle origen no tiene ninguna calle de procedencia
        if (posicionCalleCambiar == 1){
            let conexion = 0;
            let numSalidas = data[calleDondeBuscoNuevaSalida].conexion[conexion].salidas.length;
            //si solo hay una salida no se va a poder cambiar esta a otra aleatoria
            if (numSalidas == 1){
                continue;
            }
            calleCambiada = data[calleDondeBuscoNuevaSalida].conexion[conexion].salidas[Math.floor(Math.random() * numSalidas)];
        }
        //si quieres cambiar una calle que no sea la 1 tendras que elegir otra salida de la calle anterior y sera necesario saber
        //la conexion de esta, es decir la calle de procedencia para poder elegir las salidas correctas
        else{
            let calleAnteriorBuscarConexion = data[recorrido[posicionCalleCambiar - 2]].id;
            let numConexiones = data[calleDondeBuscoNuevaSalida].conexion.length;
            let conexion = elegirConexion(calleDondeBuscoNuevaSalida,calleAnteriorBuscarConexion, data, numConexiones);
            let numSalidas = data[calleDondeBuscoNuevaSalida].conexion[conexion].salidas.length;
            //si solo hay una salida no se va a poder cambiar esta a otra aleatoria
            if (numSalidas == 1){
                continue;
            }
            calleCambiada = data[calleDondeBuscoNuevaSalida].conexion[conexion].salidas[Math.floor(Math.random() * numSalidas)];
        }

        
        //se comprueba que la salida alternativa escogida de forma aleatoria es diferente
        if (calleNoCambiada != calleCambiada){
            calleDiferente = true;
            recorrido[posicionCalleCambiar] = calleCambiada;
        }
    }
    console.log("recorrido despues: ", recorrido);
    return recorrido;
}

//cambia el orden de 2 calles del recorrido, sin alterar el origen ni destino, se asegura que las
//dos calles cambiadas en el recorrido esten juntas
function cambiarOrden(recorrido){
    console.log("recorrido original: " + recorrido)
    let posicionA = Math.floor(Math.random() * (recorrido.length-2)) + 1;
    let posicionB;
    do {
        posicionB = Math.floor(Math.random() * (recorrido.length-2)) + 1;
    }
    while (Math.abs(posicionA - posicionB) != 1);

    let primeraCalle = recorrido[posicionA]
    let segundaCalle = recorrido[posicionB]
    recorrido[posicionA] = segundaCalle
    recorrido[posicionB] = primeraCalle
    console.log("recorrido despues: " + recorrido)
    return recorrido;

}

//añade una calle en una posicion aleatoria que no sea origen ni destino, esta calle nueva
//no puede ser igual a ninuna otra que ya contenga el recorrido
function añadirCalle(data, recorrido){    
    let calleAñadidaNueva = false;    
    console.log("recorrido original: " + recorrido)

    while (!calleAñadidaNueva){
        let calleAñadida = 0;
        let posicionAñadir = Math.floor(Math.random() * (recorrido.length-2)) + 1;
        let calleDondeBuscoNuevaSalida = data[recorrido[posicionAñadir - 1]].id;
        if (posicionAñadir == 1){
            let conexion = 0;
            let numSalidas = data[calleDondeBuscoNuevaSalida].conexion[conexion].salidas.length;
            //si solo hay una salida no se va a poder añadir otra calle diferente
            if (numSalidas == 1){
                continue;
            }
            calleAñadida = data[calleDondeBuscoNuevaSalida].conexion[conexion].salidas[Math.floor(Math.random() * numSalidas)];
        }
        //si quieres añadir una calle que no sea la 1 tendras que elegir una salida de la calle anterior y sera necesario saber
        //la conexion de esta, es decir la calle de procedencia para poder elegir las salidas correctas
        else{
            let calleAnteriorBuscarConexion = data[recorrido[posicionAñadir - 2]].id;
            let numConexiones = data[calleDondeBuscoNuevaSalida].conexion.length;
            let conexion = elegirConexion(calleDondeBuscoNuevaSalida,calleAnteriorBuscarConexion, data, numConexiones);
            let numSalidas = data[calleDondeBuscoNuevaSalida].conexion[conexion].salidas.length;
            //si solo hay una salida no se va a poder añadir otra calle diferente
            if (numSalidas == 1){
                continue;
            }
            calleAñadida = data[calleDondeBuscoNuevaSalida].conexion[conexion].salidas[Math.floor(Math.random() * numSalidas)];
        }

        //comprobamos que la calle que vamos a añadir no este ya en el recorrido, de ser asi se añadira
        if (!calleRepetida(recorrido, calleAñadida)){
            recorrido.splice(posicionAñadir, 0, calleAñadida);
            console.log("recorrido añadido: " + recorrido)
            calleAñadidaNueva = true;
        }
    }
    return recorrido;
}



//crea una copia del recorrido correcto
function crearCopiaRecorrido(recorrido){
    let recorridoCopia = [];
    for(let i = 0; i < recorrido.length; i++){
        recorridoCopia[i] = recorrido[i]
    }
    return recorridoCopia;
}



//funcion que se activa al pulsar el boton "SIGUIENTE PREGUNTA" manda el formulario con la respuesta seleccionada
function comprobarRespuesta(){
    let numeroTotalPreguntas = 10;
    //const respuesta = document.getElementById("botonEnviar");
    let callejero = document.forms["callejero"];
    numeroPregunta++;
    if(callejero["alternativa"].value == respuestaCorrecta){
        aciertos++;
        resultadoPreguntas += "<br> ACIERTO";
    }
    else if(callejero["alternativa"].value == ""){
        alert("Debes seleccionar alguna opción.");
        numeroPregunta--;
        return false;
    }
    else if (callejero["alternativa"].value == 4){
        resultadoPreguntas += "<br> NO CONTESTADA";
    }

    else if(callejero["alternativa"].value != respuestaCorrecta){
        fallos++;
        resultadoPreguntas += "<br> FALLO";
    }
    
	//añadimos al vector correccion el resultado de la pregunta correspondiente con la correccion
    correccion.push(resultadoPreguntas);
    resultadoPreguntas = "";
    vaciarAlternativaes();

    //si el numero de la pregunta es menor o igual al total de preguntas que se requiere para acabar el formulario
    //realizara una nueva pregunta 
    if(numeroPregunta <= numeroTotalPreguntas){
        realizarPeticion();
    }
    //si se ha completado el numero de preguntas requeridas te mostrara el resultado obtenido y las respuestas correctas
    //de cada pregunta y te habilitara la opcion de volver a realizar el cuestionario y de volver a la pagina principal
    else{
        numeroPregunta--;
        let nota = (aciertos - (fallos * 1/2)) / numeroPregunta * 10
        if (nota < 0){
            nota = 0;
        }
        alert ("Has terminado tu nota es: " + nota)

        const correcciones = document.getElementById("correcciones");
        for(let i = 0; i < correccion.length; i++){
            const nuevaCorreccion = document.createElement("p");
            nuevaCorreccion.innerHTML = correccion[i];
            nuevaCorreccion.style.backgroundColor = "rgb(4, 57, 80)";
            nuevaCorreccion.style.marginBottom = "15px";
            nuevaCorreccion.style.borderRadius = "10px";
            nuevaCorreccion.style.padding = "5px 10px 5px 15px";
            correcciones.appendChild(nuevaCorreccion);
        }

        ocultarElementos();
        contenedorResultado.style.display="block";
        reiniciar.style.display = "inline";
        reiniciar.addEventListener("click",reiniciarCuestionario);    
    }
}

//se encarga de deseleccionar la alternativa escogida para que la eleccion aparezca despejada al mostrar una nueva pregunta
function vaciarAlternativaes(){
    opcionElegida.classList.remove("opcionElegida");
    const opcion1 = document.getElementById("opcion1");
    const opcion2 = document.getElementById("opcion2");
    const opcion3 = document.getElementById("opcion3");
    const opcion4 = document.getElementById("opcionVacia");
    opcion1.checked = false;
    opcion2.checked = false;
    opcion3.checked = false;
    opcion4.checked = false;

}

//cada vez que se genera una nueva pregunta se llama a esta funcion para almacenar el enunciado y la respuesta correcta para poder
//mostrarlas una vez haya terminado el cuestionario
function añadirResultadoPreguntas(nombreRecorridoCorrecto, fraseEnunciado, numPregunta){
    resultadoPreguntas += "Pregunta número: " + numPregunta + "<br>" + fraseEnunciado + "<br>" + nombreRecorridoCorrecto;
}

//oculta el formulario cuando este ya ha sido completado, de esta forma apareceran solas las respuestas y la correccion
function ocultarElementos(){
    const formulario = document.getElementById("formulario");
    const footer = document.getElementById("footer");
    formulario.style.display = "none";
    footer.style.display = "none";
}

//al seleccionar volver a realizar el cuestionario la pagina se reiniciara
function reiniciarCuestionario(){
    location.reload();
}
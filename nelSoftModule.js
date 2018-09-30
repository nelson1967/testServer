exports.propsObjeto = (objeto) => {
  app = "%propsObjeto";
  let string1 = "";
  if (typeof(objeto) != "function") {
    for (let propiedad in objeto) {
      // console.log("--- I --- tipo del atributo '"+propiedad+"' :", typeof(objeto[propiedad]));
      if (typeof(objeto[propiedad]) == "object") {
        // console.log(app+"-I-OBJECTFOUND, objeto encontrado en la estructura de datos: ", propiedad);
        if (objeto[propiedad] != null) {
          exports.propsObjeto(objeto[propiedad]);
        }
      }
      else {
        if (typeof(objeto[propiedad]) != "function") {
          string1 = string1 + app + "-I-PROPVALUE, propiedada y valor de ("+typeof(objeto[propiedad])+") " + propiedad + ": " + objeto[propiedad] +'\n';
        }
      }
    }
    console.log(string1);
  }
}

exports.horaActual = function(fechaActual, formato) {
  if (arguments[0] == null) {
    fechaActual = new Date();
  }
  if (arguments[1] == null) {
    formato = 0
  }
  fechaActual = new Date(fechaActual);
  if (fechaActual == "Invalid Date") {
    return "Invalid Date";
  }
  let aaaa = fechaActual.getFullYear();
  let me = fechaActual.getMonth() + 1;
  let dd = fechaActual.getDate();
  let hh = fechaActual.getHours();
  let mm = fechaActual.getMinutes();
  let ss = fechaActual.getSeconds();
  if (me < 10) {  me = "0" + me;}
  if (dd < 10) {  dd = "0" + dd;}
  if (hh < 10) {  hh = "0" + hh;}
  if (mm < 10) {  mm = "0" + hh;}
  if (ss < 10) {  ss = "0" + hh;}
  switch (formato) {
    case 1:
      return aaaa + "/" + me + "/" + dd + " " + hh + ":" + mm + ":" + ss;
      break;
    case 0:
      return fechaActual;
      break;
    default:
      return aaaa + "/" + me + "/" + dd + " " + hh + ":" + mm + ":" + ss;
  }
// formato entregado AAAA/MM/DD hh:mm:ss
}

exports.getTipo = function(url_path) {
//  console.log("Recibí:", url);
  let app = "%getTipo";
  let archivotmp = url_path.split("/");
  let tipo = "";
  if (archivotmp[archivotmp.length - 1].length != 0) {
    let archivo = archivotmp[archivotmp.length-1].split(".");
    tipo = archivo[archivo.length-1];
  }
  console.log(app+"-I-FILETYPE, Tipo de archivo:", tipo);
  return tipo;
}

exports.getFileCfg = function(archivo) {
  // Se lee un archivo que tiene registros con informacion del tipo variable = valor
  // Se omiten comentarios (empiezan con #) y lineas en blanco
  // Devuelve un objeto con atributos con nombre de la variable en el archivo
  let file_data = "";
  let retorno = new Object();
  try{
    file_data = require('fs').readFileSync(archivo, "utf-8");
  } catch(e) {
    console.warn("%getFileCfg-E-FILENOTFOUND, Archivo requerido", archivo, "no encontrado");
    return retorno;
  }
  console.log("%getFileCfg-I-FILECFG, Parametros de configuración obtenidos desde " + archivo);
  wrk_data1  = file_data.split('\n');
  wrk_data = [];
  for (let i = 0; i < wrk_data1.length; i++) {
    if (wrk_data1[i].trim()[0] != "#" && wrk_data1[i].trim().length > 0) {
      let wrk_datatmp = wrk_data1[i].split("=");
      if (wrk_datatmp.length == 2) {
        retorno[wrk_datatmp[0].trim()] = wrk_datatmp[1].trim();
      }
    }
  }
  return retorno;
}

exports.genCookie = function(cname, cvalue, exdays) {
  var d = new Date();
	if (arguments.length == 0){
		cname = document.getElementById("c1").value;
		cvalue = document.getElementById("v1").value;
		exdays = 1;
	}
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  cadena_cookie = cname + "=" + cvalue + ";" + expires + ";path=/;";
	document.cookie = cadena_cookie;
	global = global + 1;
  console.log("Cookie creada o modificada (", global, "): ", document.cookie);
}

exports.getCookies = (h) => {
  let app = "%getCookies";
  let lista = {},
  rc = h.cookie;
  rc && rc.split(';').forEach(function( cookie ) {
      let partes = cookie.split('=');
      lista[partes.shift().trim()] = decodeURI(partes.join('='));
    });
  console.log(app+"-I-SHOWCOOKIES, las cookies en el header son:", lista);
  return lista;
}

exports.validarInput = (cadena, patron, lista) => {
  // patron: 1 caracteres ascii de uso comun para nombres de variables, sin caracteres raros ni espacios
  // patron: 2 lista separada por comas en parametro 3
  let app = "validarInput";
  let retorno = true;
  if (typeof(patron) != "number") {
    patron = 1;
  }
  if (typeof(cadena) != "string") {
    return false;
  }

  let espacio_a_revisar	= [""];
  for (let i=1;i<=255;i++){
  	espacio_a_revisar.push("");
  	if (i>=65 && i<=90){ // minusculas
  		espacio_a_revisar[i] = String.fromCharCode(i);
      continue;
  	}
    if (i>=97 && i<=122){ // mayusculas
  		espacio_a_revisar[i] = String.fromCharCode(i);
      continue;
  	}
  }

  let espacio_numeros			= [""];
  for (let i=1;i<=255;i++){
  	espacio_numeros.push("");
  	if (i>=48 && i<=57){
  		espacio_numeros[i] = String.fromCharCode(i);
  	}
  }

  let ascii = (a) => {
  	return a.charCodeAt(0);
  }

  let cadena_en_espacio = (cad, espa)	=> {
    let pertenece_al_espacio = true;
  	let cod = 0;
  	for (let a = 0; a < cad.length; a++) {
  		cod = ascii(cad[a]);
  		if (espa[cod] == "") {
  			pertenece_al_espacio = false;
			  console.log(app+"-E-, Caracter inválido:", cad[a], " en posición:", a);
  			break;
  		}
  	}
  	return pertenece_al_espacio;
  }

  switch (patron) {
    case 1:
      return (cadena_en_espacio(cadena, espacio_a_revisar));
      break;
    case 2:
      if ((","+lista+",").includes(","+cadena+",")) {
        return true;
      }
      else {
        return false;
      }
      break;
    default:
      return false;
  }
}

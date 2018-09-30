const http = require('http'); // Loads the http module
let fs = require('fs'); // Loads el modulo File Systen parar gestion de archivos en el fs
let url = require('url'); //
var datos = require('./nelSoftModule.js'); // Modulo de funciones y metodos propios

function parseCookies (request) {
  var list = {},
  rc = request.headers.cookie;
  rc && rc.split(';').forEach(function( cookie ) {
      var parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
  return list;
}

let ppal = (request, response) => {
  console.log("-I-RESPPREP, Preparando respuesta...", pag_url[0]);
  let arch_send = "";
  let tipo_contenido = "text/html; charset=utf-8";
  let contenido_arch = "";
  switch (pag_url) {
      case '/css/puntajes.css':
        arch_send = pag_url.substr(1, pag_url.length);
        // for (let i = 1; i < pag_url.length; i++) {
        //   arch_send1[i-1] = pag_url[i];
        // }
        // arch_send = arch_send1.toString();
        console.log("Arch_send.... ", arch_send);
        tipo_contenido = "text/css; charset=utf-8";
        break;
      case '/css/bootstrap/bootstrap.min.css':
        arch_send = pag_url.substr(1, pag_url.length);
        // for (let i = 1; i < pag_url.length; i++) {
        //   arch_send1[i-1] = pag_url[i];
        // }
        // arch_send = arch_send1.toString();
        tipo_contenido = "text/css; charset=utf-8";
        break;
      case '/js/puntajes.js':
        arch_send = pag_url.substr(1, pag_url.length);
        // for (let i = 1; i < pag_url.length; i++) {
        //   arch_send1[i-1] = pag_url[i];
        // }
        // arch_send = arch_send1.toString();
        tipo_contenido = "text/script; charset=utf-8";
        break;
      case '/':
        tipo_contenido = "text/html; charset=utf-8";
        arch_send = arch_home;
        break;
      case '/Git':
        tipo_contenido = "text/html; charset=utf-8";
        arch_send = arch_home;
        break;

      default:
        tipo_contenido = "text/html; charset=utf-8";
        arch_send = arch_home;
        break;
  }
  console.log("Archivo a enviar: ", arch_send);
  response.writeHead(200, { 'Content-Type': tipo_contenido });
  if (fileExists(arch_send)) {
    console.log("-I-SENDFILE, enviando archivo", arch_send, "con Content-Type:", tipo_contenido);
    contenido_arch = fs.readFileSync(arch_send, 'utf-8');
  }
  else {
    contenido_arch = home_arch;
    console.log("-E-SENDFILE, enviando archivo por defecto...");
  }
//    response.write('<p style="color:red;">Hello, World!\n</p><p style="color:blue;">El requerimiento es: ' + request.url + '</p>');
  response.write(contenido_arch);
  response.end();
  console.log("-I-SENDEND, Fin envio archivo", arch_send);
}

let nelson = (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    let respuesta = '<h1>Hola Nelson</h1>' +
        '<p style="color:red;">Hola</p>' +
        '<p style="color:blue;">El requerimiento es: ' + request.url + '</p>' +
        datos.myDateTime();
    response.write(respuesta);
    response.end();
}

let git = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  let respuesta = fs.readFileSync('../../../cursos/udemy.git/home.html', 'utf-8');
  response.write(respuesta);
  response.end();
}

let getJuegos = (request, response, galleta) => {
// parse all_param parar ser la cookie
  if (val_cookie) {
    var str_cookie = "usr_juegos="+usuario;
  } else {
    var str_cookie = "";
  }
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Set-Cookie': str_cookie });
  let respuesta = "<!DOCTYPE html><head></head><body><h1>las cookies en esta página</h1>" + "<p>" + galleta + "</p></body>";
  response.write(respuesta);
  response.end();
}

let otros = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  let respuesta = '<h1>Hola Nelson</h1>' +
      '<p style="color:red;">URL:'+all_url+'</p>' +
      '<p style="color:blue;">Página: ' + pag_url + '</p>' +
      '<p style="color:white; background-color:black;">Parámetros: ' + all_param + '</p>' +
      '<p>A las: ' + datos.myDateTime() + '</p>';
  response.write(respuesta);
  response.end();
}

let fileExists = (arch) => {
  console.log("-I-FINDFILE, Buscando archivo", arch, "...");
  try{
    require('fs').accessSync(arch)
    console.log("-I-FILEFOUND, Archivo", arch, "encontrado");
    return true;
  }catch(e){
    console.log("-E-FILENOTFOUND, Archivo", arch, "no encontrado");
    return false;
  }
}

// Lectura asincrona del archivo
// fs.readFile('../../llevar-juegos/home.html', 'utf-8', (err, data) => {
//   if(err) {
//     console.log('error: ', err);
//   } else {
//     console.log(data);
//   }
// });

// Lectura sincrona del archivo
test = "123";
console.log("Print 1er caracter de ", test, "es: ", test[0]);
console.log("..... Incomming messages in progress ..... \n----------------------------------------------------------------------");
let arch_home = "../../llevar-juegos/home.html";
let home_arch = fs.readFileSync(arch_home, 'utf-8');
let dat_no_encontrado = "<h1 style='color:red'>Hemos experimentado un problema con su petición</h1><h4>Error 404</h4><h5>By NelsSoft</h5>";
let all_url = "";
let pag_url = "";
let all_param = "";
let arch_config = "cfg/config.cfg";
console.log("Leer archivo de configuración...");
if (fileExists(arch_config)) {
  console.log("Archivo de configuracion leido");
  console.log(fs.readFileSync(arch_config, 'utf-8'));
}
else {
  port_srv = 1337;
  path_ini  = "/";
  lista_ips = "0.0.0.0";
  console.log("-W-NOFILECFG, Archivo de configuración ", arch_config, " del servidor no existe. Configuración por omisión");
  console.log("-I-PATHSRV, Servidor con acceso a path: ", path_ini);
  console.log("-I-IPSSRV, Direcciones IPs con acceso al servicio: ", lista_ips);
  console.log("-I-PORTSRV, Puerto de acceso al servicio: ", port_srv);
}

let i = 0;
http.createServer((request, response) => {
  // 1. Tell the browser everything is OK (Status code 200), and the data is in plain text
//  console.log("host: ", request.headers.host);
//  console.log("IncomingMessage : ", http.IncomingMessage);
//  console.log("-Info-SOCKET\n", request.socket.defaultEncoding, request.socket.keepAliveTimeout);
  console.log('-I-URL, URL solicitada por el cliente: ', request.url);
// descomposicion del URL en path y parámetros
  all_url = url.parse(request.url).href;
  pag_url = url.parse(request.url).pathname;
  all_param = url.parse(request.url).query;
  console.log("url:", all_url, " pathname:", pag_url, " query:", all_param);
  usuario = "";
  set_cookie = false;
  // all_url = request.url.split('?');
  // pag_url = all_url[0];
  // all_param = all_url[1];

//Revisión de cookies en el HEADER
  // console.log("-Info-HEADER HTML checking... cookie\n-----------------");
  // console.log(request.headers.cookie);
  if (pag_url == "/Git") {
    return git(request, response);
  }
  let cookies = request.headers.cookie.split(";");
  if (cookies.length != 0) {
    for (let i = 0; i < cookies.length; i++) {
//      console.log("Cookie: ", i, ": ", cookies[i]);
      nom_cookie = cookies[i].split('=')[0];
      val_cookie = cookies[i].split('=')[1];
      if (nom_cookie == "usr_juegos") {
        usuario = val_cookie;
//        console.log("La cookie 'usr_juegos' = ", val_cookie);
      }
    }
    console.log("Fin evaluacion de las cookies...");
    if (usuario != "" || pag_url == "/obtener_juegos.html") {
      usuario = url.parse(request.url, true).query.usr_juegos;
      // parametros = all_param.split("&");
      // for (let i = 0; i < arametros.length; i++) {
      //   let nom_param = parametros[i].split('=')[0];
      //   let val_param = parametros[i].split('=')[1];
      //   if (nom_param == 'usr_juegos') {
      //     usuario = val_param;
      //   }
      // }
      console.log("Con usuario:", usuario);
//      console.log("Página: ", pag_url);
      if (pag_url == "/obtener_juegos.html") {
        set_cookie = true;
      }
      return getJuegos(request, response, val_cookie);
    } else {
      console.log("Sin usuario...");
      return ppal(request, response);
    }
  } else {
  //  console.log("Esta conexión no tiene cookies...");
    return ppal(request, response);
  }

  response.writeHead(404,{ 'Content-Type': 'text/html; charset=utf-8' });
  response.write(dat_no_encontrado);
  response.end(http.STATUS_CODES[404]);
  // 2. Write the announced text to the body of the page
  // 3. Tell the server that all of the response headers and body have been sent
}).listen(1337); // 4. Tells the server what port to be on

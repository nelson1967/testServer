const http = require('http'); // Loads the http module
let fs = require('fs'); // Loads el modulo File Systen parar gestion de archivos en el fs
let url = require('url'); // Loads módulo gestión de la URL
let path = require('path'); // Loads modulo con gestion de path

let datos = require('./nelSoftModule.js'); // Modulo de funciones y metodos propios

let dspLog = (severidad, cadena) => {
  let invocadapor = dspLog.caller; //no funciona
  let supercadena = "-"+severidad+"-"+invocadapor+", "+cadena;
  console.log(supercadena);
}
let checkRequest = (ourl) => {
  let app = "%checkRequest";
  console.log(app+"-I-OBJURL, Objeto URL a chequear: ", ourl);
  if (Object.keys(ourl.cookies).length == 0) {
    console.log(app+"-I-NOTCOOKIES, NO hay cookies en el HEADER");
  }
  else {
    console.log(app+"-I-COOKIES, el HEADER tiene cookies", ourl.cookies);

  }
// Se usa la variable global tbl_usr
  return true;
}

let respuesta = (request, response) => {
  let app = "%respuesta";
  let dato_env = fs.readFileSync(arch_req);
  let tipo_contenido = "";  // Determinar el contenido del archivo a enviar 'Content-Type'
  console.log(app+"-I-PROCFILE, archivo a enviar ", arch_req, " del tipo ", obj_url.tipo);
  switch (obj_url.tipo) {
    case 'css':
      tipo_contenido = "text/css; charset=utf-8";
      break;
    case 'js':
      tipo_contenido = "text/javascript; charset=utf-8";
      break;
    case 'png' || 'jpeg' || 'jpg':
      tipo_contenido = "jpeg";
      break;
    case 'ttf':
      tipo_contenido = "font/ttf";
      break;
    case 'woff':
      tipo_contenido = "application/font-woff";
      break;
    case 'woff2':
      tipo_contenido = "application/font-woff2";
      break;
    case 'html':
      tipo_contenido = "text/html; charset=utf-8";
      let parametros = obj_url.query;
      let cookies = obj_url.cookies;
      let usr_existe = false;
      switch (obj_url.pathname) {
        case '/registro_usuario.html':
          break;
        case '/solicitar_registro.html':
          break;
        case '/obtener_juegos.html': //Es el acceso al sistema debe venir usr/pwd
          // sesion = checkUsrPwd(obj_url.query);
          // -- si sesion no existe asignar sesion a tbl_usr
          // if (sesion) {
          //   sesion =
          // }
          // else {
          //   dato_env = getPag("no_usr_pwd")
          // }
          if (Object.keys(cookies).length != 0) {
            parametros.srv_juego = cookies.srv_juego;
            parametros.usr_juegos = cookies.usr_juegos;
            usr_existe = true;
          }
          //Validar juego en lista de juegos permitidos y valor del dato ingresado (validez)
          lista_juegos = "carioca,escoba,otro"
          if (datos.validarInput(parametros.usr_juegos, 1, null) && datos.validarInput(parametros.srv_juego, 2, lista_juegos)) { // ej juego ascii permitido y menos de 20 caracteres
            if (parametros.remember == "on") {
              if (!usr_existe) {
                // Generar cookie usr_juegos = Valor de la variable parametros.usr_juegos
                // Generar cookie srv_juego = Valor de la variable parametros.srv_juego
                console.log(app+"-I-GENCOOKIES, Deben generarse las cookies... ");
              }
            }
            arch_juego = datos_cfg.user_path + "/" + parametros.srv_juego + "_" + parametros.usr_juegos + ".ptje"
            if (!fileExists(arch_juego)) {
              fs.writeFileSync(arch_juego, `# ${datos.horaActual(null, 1)} ${parametros.usr_juegos}`, "utf-8");
              console.log(app+"-I-NEWDATA, Nuevo espacio para datos generado para el usuario", parametros.usr_juegos);
              // Generar archivo con puntaje vacio en el directorio usuarios --> nomjuego_nombreusr.ptje
            }
            // Procesar los datos del usuario
            datos_ok = true;
            datos_juego = datos.getFileCfg(arch_juego);
            suma_juego = 0;
            for (item in datos_juego) {
              if (typeof(parseInt(datos_juego[item])) != "number") {
                console.log(app+"-F-BADDATA, Error en datos del usuario para el juego ", parametros.srv_juego);
                datos_ok = false;
                break;
              }
              suma_juego = suma_juego + parseInt(datos_juego[item]);
            }
            if (datos_ok) {
              console.log(app+"-I-PTJEUSR, los puntajes de ", parametros.usr_juegos, "en el juego de", parametros.srv_juego, "son:", datos_juego);
              console.log(app+"-I-PTJETOT, Puntaje total de ", parametros.usr_juegos, " es de:", suma_juego);
              if (fileExists(arch_req)) {
                file_send = fs.readFileSync(arch_req, "utf-8");
                let p1 = dom.window.document.getElementById("juego_usr");
                console.log(app+"-I-DOM, Element id = juego_usr: ", p1);
              }
              htm = "<!DOCTYPE html><html lang='es' dir='ltr'>";
              htm += "<head><meta charset='utf-8'><title>Get Juegos</title></head>";
              htm += "<link rel='stylesheet' href='css/puntajes.css'>";
              htm += "<link rel='stylesheet' href='css/bootstrap/bootstrap.min.css'>";
              htm += "<script src='js/obtener_juegos.js'></script>";
              htm += "<body><div class='container'><h3>" + parametros.srv_juego + "</h3><h5><span>"+datos.horaActual()+"</span>";
              htm += "<div class='page-header'>" + parametros.usr_juegos + " tu puntaje:"
              htm += "<div class='form-control' id='total'><b>" + suma_juego + "</b></div></div></div>";
              htm += "<div class='container'>Puntaje de los otros jugadores:";
              htm += "<span class='form-control'>Nandy 72</span>";
              htm += "<span class='form-control'>Nelsi 54</span>";
              htm += "<span class='form-control'>Cami  85</span>";
              htm += "<span class='form-control'>Vale 32</span>";
              htm += "</div></body></html>";
              // objeto con atributos {ronda1: N, ronda2: M ...}
              //Generar respuesta en DOM de HTML requerido obtener_juegos.html
              dato_env = htm;
            }
            else {
              // Construis respuesta con los errores
              console.log(app+"-E-DATACORRUPT, La información del usuario es inconsistente");
            }
          }
          else {
            //Construir respuesta de error // IDEA: Modificar el DOM del dato_env
            console.log(app+"-E-NOUSRVAL, Usuario no es valido o informacion requerida erronea: ", parametros);
          }
          break;
        case '/home.html':
          console.log(app+"-I-HOMERQST, Home del sitio requerido");
          break;
        default:
          dato_env = "<h3 class='lead'>Requerimiento HTML desconocido "+arch_req+"</h3>";
      }
      break;
    default:
      tipo_contenido = "text/plain; charset=utf-8";
      dato_env = "<h3 class='lead'>Tipo de archivo desconocido</h3><p class='lead'>"+obj_url.tipo+"</p></h3>";
  }
  response.writeHead(200, { 'Content-Type': tipo_contenido });
  response.write(dato_env);
  response.end();
}

let fileExists = (arch) => {
  let app = "fileExists";
  try{
    require('fs').accessSync(arch);
//    console.log("-I-FILEFOUND, Archivo ", arch, "encontrado");
    return true;
  }catch(e){
    console.log(app+"-E-FILENOTFOUND, Archivo requerido", arch, "no encontrado");
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
// console.log("..... Incomming messages in progress ..... \n----------------------------------------------------------------------");
// MAIN
let app = "%httpsvr2";
let arch_config = "cfg/config.cfg";
datos_cfg = datos.getFileCfg(arch_config);
if (Object.keys(datos_cfg).length <= 0) {
  console.log(app+"-F-NOCFG, No existe información para configurar el servidor WEB");
  process.exit(1);
}
if (fileExists(datos_cfg.home_path)) {
  process.chdir(datos_cfg.home_path);
}
else {
  console.log(app+"-E-NOPATH, Path de inicio servidor no existe, path definido .");
}
console.log(app+"-I-DIRHOME, Directorio para el home (en curso) : ", path.resolve("."));
datos.propsObjeto(datos_cfg);
// estructura global para conexiones aceptadas por el servidor WEB
let tbl_usr = [];
// es un arreglo de objetos conectados al Servidor
// cada objeto tiene propiedades IPAcceso, Usuario, hash(IPAcceso, Usuario)

servidor = http.createServer((request, response) => {
// Armar objeto URL (obj_url) con toda la info del url
  obj_url = new Object();
  obj_url = url.parse(request.url, true); // GET parseado como objeto
  obj_url.path = datos_cfg.home_path;
  if (obj_url.pathname == "/") {
    obj_url.pathname = "/" + datos_cfg.home_html;
  }
  obj_url.tipo = datos.getTipo(obj_url.pathname);
  obj_url.ip = request.socket.remoteAddress;
  obj_url.cookies = datos.getCookies(request.headers);
  let in_ok = checkRequest(obj_url); // esto debería ser asíncrono. Si es un bad request --> home
  if (in_ok) {
    arch_req = obj_url.path + obj_url.pathname;
  //  arch_req = pag_url.substr(1, pag_url.length);
    if (fileExists(arch_req)) {
      return respuesta(request, response);
    } else {
      if (fileExists(datos_cfg.error_404)) {
        dato_env = fs.readFileSync(datos_cfg.error_404, 'utf-8');
      } else {
        dato_env = "<h1>Archivo no encontrado...</h1><p style='color:red'>Comuniquese con webmaster@correo.com</p>";
      }
      response.writeHead(404,{ 'Content-Type': 'text/html; charset=utf-8' });
      response.write(dato_env);
      response.end(http.STATUS_CODES[404]);
    }
  }
  else {
//    console.log(app+"-I-STSCODE, Matriz de STATUS_CODE: ", http.STATUS_CODES);
    dato_env = "<div class='container'><h3 class='lead' style='color:white; backgroundColor:black'>Usuario no identificado o requerimiento erroneo</h3></div>";
    response.writeHead(404,{ 'Content-Type': 'text/html; charset=utf-8' });
    response.write(dato_env);
    response.end(http.STATUS_CODES[404]);
  }
//   console.log("---------------------------------------------------------------------------------------------------");
//   console.log(app+"-I-IPCLIENT, Direccion IP solicitando información al servidor: ", request.socket.remoteAddress);
//   console.log("r.headers     :", request.headers);
//   console.log("r.httpVersion : ", request.httpVersion);
//   console.log("r.method      :", request.method);
//   console.log("r.url :", request.url);
// //  obj_url.prototype.tipo = null;
//   console.log("\tObjeto obj_url :", obj_url);
//   console.log("\t\tHref    :", obj_url.href);
//   console.log("\t\tPath    :", obj_url.path);
//   console.log("\t\tPathname:", obj_url.pathname);
//   console.log("\t\tQuery   :", obj_url.query);

// servidor.on('connection', function(sock) {
//   console.log('Client connected from ' + sock.remoteAddress);
  // Client address at time of connection ----^
// });
});
servidor.listen(datos_cfg.port, datos_cfg.host, () => {console.log(`${app}-I-SERVER, Servidor esperando peticiones en http://${datos_cfg.host}:${datos_cfg.port}`);});

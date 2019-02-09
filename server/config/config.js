/**
 * Archivo para declarar constantes 
 */

 /**
  * Puerto
  */

  process.env.PORT= process.env.PORT || 3000;

  process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

  let urlDB;

  if(process.env.NODE_ENV==='dev'){
    urlDB='mongodb://localhost:27017/cafe';
  }else{
    urlDB= process.env.MONGO_URI;
  }
  
 process.env.URLDB = urlDB;

 /*Vencimiento de token
 60 segundos
 60 minutos
 24 horas
 30 dias
 */
 process.env.CADUCIDAD_TOKEN ='48h';

 /* semilla para tokens*/
 process.env.SEED= process.env.SEED || 'secret';

 /*GOOGLE SIG ID */
 process.env.CLIENT_ID=process.env.CLIENT_ID|| '1014493835237-1qrv6e4hvjm1vl5fqjfdh23nrijurmlq.apps.googleusercontent.com';
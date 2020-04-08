//==================================================
//puerto
//==================================================
process.env.PORT = process.env.PORT || 3001

//==================================================
//entorno
//==================================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//==================================================
//vencimiento del token
//60 segundo
//60 minutos
//24 horas
//30 dias
//==================================================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30

//==================================================
//seed del token
//==================================================
process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'este-es-el-seed-desarrollo';

//==================================================
//client id google
//==================================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '541792264744-mfruo4fb520gpma26glih8323ec9o97k.apps.googleusercontent.com';



//==================================================
//base de datos
//==================================================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}
process.env.URL_DB = urlDB;
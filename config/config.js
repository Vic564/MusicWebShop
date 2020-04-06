require('dotenv').config();

const validPort = (port) => {
    const regex = new RegExp('^()([1-9][0-9]{0,3}|[1-5][0-9]{0,4}|6[0-4][0-9]{0,3}|65[0-4][0-9]{0,2}|655[0-2][0-9]|6553[0-5])$');
    return regex.test(port);
};

const PORT = validPort(process.env.PORT) ? parseInt(process.env.PORT) : 8080;

const mongodb = process.env.MONGODB || 'mongodb';
const dbUser = process.env.DBUSER || 'test';
const dbPassword = process.env.DBPASSWORD || 'test';
const dbHostname = process.env.DBHOSTNAME || 'localhost';
const dbName = process.env.DBNAME || 'todolistapp';
const dbQuery = process.env.DBQUERY || 'retryWrites=true&w=majority';
const dbAuth = process.env.DBAUTH == 'true';

const MONGODB = {
    connection: dbAuth
    ? `${mongodb}://${dbUser}:${dbPassword}@${dbHostname}/${dbName}?${dbQuery}`
    : `${mongodb}://${dbHostname}/${dbName}?${dbQuery}`,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }
}

const spotify = {
    client_id: process.env.SPOTIFY_CLIENT_ID || 'needsconfig',
    client_secret: process.env.SPOTIFY_CLIENT_SECRET || 'needsconfig',
    query: {
        type: 'album',
        albumType: 'SINGLE',
        offset: 0,
        limit: 10
    }
}

const STRIPE = {
    public: process.env.STRIPE_PUBLIC || 'needsconfig',
    secret: process.env.STRIPE_SECRET || 'needsconfig'
}

const mailkey = {
    mailkey: process.env.SEND_GRID_KEY || 'needsconfig'
}

const tokenkey = {
    adminjwt: process.env.ADMIN_TOKEN || 'admintoken',
    userjwt: process.env.USER_TOKEN || 'usertoken'
}

const admin = {
    adminPassword: process.env.ADMIN_PASSWORD || 'admin'
}

module.exports = { MONGODB, spotify, mailkey, tokenkey, admin, PORT, STRIPE };  

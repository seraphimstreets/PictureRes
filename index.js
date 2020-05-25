var http = require('http');
var https = require('https');
var app = require('./app');
var fs = require('fs');


var options = {
    key:fs.readFileSync(__dirname + '/na.key'),
    cert:fs.readFileSync(__dirname + '/na.cert')
  };


var port = normalizePort(process.env.PORT || '3000');
//app.set('port', port);
app.set('secPort', port + 443)

var secureServer = https.createServer(options, app)

secureServer.listen(app.get('secPort'), 'localhost', () => {
    console.log('listening on port 3443')
}); 
secureServer.on('error', onError );


function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }
  
  /**
   * Event listener for HTTP server "error" event.
   */
  
  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
  
  /**
   * Event listener for HTTP server "listening" event.
   */
  
  function onListening() {
    var addr = secureServer.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }
  
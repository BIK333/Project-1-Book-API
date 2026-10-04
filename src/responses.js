const respondJSON = (request, response, status, object) => {
    const content = JSON.stringify(object);
  
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(content),
    };
  
    response.writeHead(status, headers);
  
    if (request.method !== 'HEAD') {
      response.write(content);
    }
  
    response.end();
};
  
const respondJSONMeta = (response, status) => {
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': 0,
    };
  
    response.writeHead(status, headers);
    response.end();
};
  
module.exports = {
    respondJSON,
    respondJSONMeta,
};
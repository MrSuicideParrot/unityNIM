function body(request){
  var corpo = []
  request.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    corpo.push(chunk);
  }).on('end', () => {
    corpo = Buffer.concat(corpo).toString();
  });
  console.log(corpo);
  return corpo;
}

module.exports.body = body;

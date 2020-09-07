const protobuf = require('protocol-buffers');
const fs = require('fs');
const EasySock = require('easy_sock');
const schemas = protobuf(fs.readFileSync(`${__dirname}/detail.proto`));

const easySock = new EasySock({
  ip: '127.0.0.1',
  port: 4000,
  timeout: 500,
  keepAlive: true
})

// 将需要发送的数据按协议进行二进制编码
easySock.encode = function(data, seq) {
  const body = schemas.ColumnRequest.encode(data);
  const head = Buffer.alloc(8);
  head.writeInt32BE(seq);
  head.writeInt32BE(body.length, 4);
  return Buffer.concat([head, body]);
}

// 将接收到的包进行解码，转换成js可操作的格式
easySock.decode = function(buffer) {
  const seq = buffer.readInt32BE();
  const body = schemas.ColumnResponse.decode(buffer.slice(8));
  return {
    result: body,
    seq
  }
}

// 判断当前数据包是否完整
easySock.isReceiveComplete = function(buffer) {
  if (buffer.length < 8) {
    return 0;
  }
  const bodyLength = buffer.readInt32BE(4);
  if (buffer.length >= bodyLength + 8) {
    return bodyLength + 8
  } else {
    return 0;
  }
}

module.exports = easySock;
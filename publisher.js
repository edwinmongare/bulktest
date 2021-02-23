const amqp = require("amqplib/callback_api");
const dgram = require("dgram");
const PORT = 8011;
const HOST = "0.0.0.0";
const loginFrameReply = new Buffer.from(
  "403A0009151314691661010025a0D0A",
  "hex"
).toString("ascii");
const dataframeReply = new Buffer.from(
  "403A000B15131469166108010100310D0A",
  "hex"
).toString("ascii");
const dataframeReplyTwo = new Buffer.from(
  "403A000B15131469166108010200310D0A",
  "hex"
).toString("ascii");

amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    const queueOne = "loginframeQueue";
    const queueTwo = "dataframeQueue";
    const server = [];
    for (let i = 0; i < 5; i++) {
      server[i] = dgram.createSocket("udp4");

      server[i].on(
        "listening",
        function () {
          const address = this.address();
          console.log(
            "UDP Server listening on " + address.address + ":" + address.port
          );
        }.bind(server[i])
      );

      server[i].on("close", function () {
        console.log("udp socket closed..");
      });

      server[i].on(
        "message",
        function (message, remote) {
          console.log(
            "Data received from client : " +
              Buffer.from(message, "ascii").toString("hex")
          );

          this.send(
            loginFrameReply,
            remote.port,
            remote.address,
            function (err, bytes) {
              if (err) throw err;
              console.log(
                `UDP message: ${loginFrameReply} bytes: ${bytes} sent to ${remote.address}:${remote.port}`
              );
            }
          );
          // this.send(
          //   dataframeReply,
          //   remote.port,
          //   remote.address,
          //   function (err, bytes) {
          //     if (err) throw err;
          //     console.log(
          //       `UDP message dataframe reply One: ${dataframeReply} bytes: ${bytes} sent to ${remote.address}:${remote.port}`
          //     );
          //   }
          // );
          // this.send(
          //   dataframeReplyTwo,
          //   remote.port,
          //   remote.address,
          //   function (err, bytes) {
          //     if (err) throw err;
          //     console.log(
          //       `UDP message dataframe reply two: ${dataframeReplyTwo} bytes: ${bytes} sent to ${remote.address}:${remote.port}`
          //     );
          //   }
          // );
          const msg = message;
          if (msg.length != 0 && msg.length < "200") {
            channel.assertQueue(queueOne, {
              durable: false,
            });
          } else {
            channel.assertQueue(queueTwo, {
              durable: false,
            });
          }

          if (msg.length != 0 && msg.length < "200") {
            channel.sendToQueue(queueOne, Buffer.from(msg));
          } else {
            channel.sendToQueue(queueTwo, Buffer.from(msg));
          }
          console.log(" message sent to :", msg, "message length", msg.length);
        }.bind(server[i])
      );
      server[i].bind(PORT + i, HOST);
    }
  });
  // setTimeout(() => {
  //   connection.close();
  //   process.exit(0);
  // }, 500);
});

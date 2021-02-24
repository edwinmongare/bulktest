const amqp = require("amqplib/callback_api");
const dgram = require("dgram");
const PORT = 8011;
const HOST = "0.0.0.0";
const loginFrameReply = new Buffer.from(
  "403A00091513146916610100260D0A",
  "hex"
).toString("ascii");
const TimeFrameSend = new Buffer.from(
  "403AFF011513146916610921022307151600890D0A",
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
let sendData = true;

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
        async function (message, remote) {
          console.log(
            "Data received from bulk meter : " +
              Buffer.from(message, "ascii").toString("hex")
          );
          if (message.length <= 80) {
            await this.send(
              loginFrameReply,
              remote.port,
              remote.address,
              function (err, bytes) {
                if (err) throw err;
                console.log(
                  `Login Frame Reply Sent: ${Buffer.from(
                    loginFrameReply,
                    "ascii"
                  ).toString("hex")} bytes: ${bytes} sent to ${
                    remote.address
                  }:${remote.port}`
                );
              }
            );
          } else if (message.length >= 500 && message.slice(24, 26) == "01") {
            // const dataframeReply = new Buffer.from(
            //   `403A000B1513146916610801${message.slice(24, 26)}00310D0A`,
            //   "hex"
            // ).toString("ascii");
            // const dataframeReply = new Buffer.from(
            //   "403A000B15131469166108010100310D0A",
            //   "hex"
            // ).toString("ascii");
            await this.send(
              dataframeReply,
              remote.port,
              remote.address,
              function (err, bytes) {
                if (err) throw err;
                console.log(
                  `Data Frame One Reply Sent: ${Buffer.from(
                    dataframeReply,
                    "ascii"
                  ).toString("hex")} bytes: ${bytes} sent to ${
                    remote.address
                  }:${remote.port}`
                );
              }
            );
          } else if (message.length >= 500 && message.slice(24, 26) == "02") {
            // const dataframeReply = new Buffer.from(
            //   `403A000B1513146916610801${message.slice(24, 26)}00310D0A`,
            //   "hex"
            // ).toString("ascii");
            // const dataframeReply = new Buffer.from(
            //   "403A000B15131469166108010100310D0A",
            //   "hex"
            // ).toString("ascii");
            await this.send(
              dataframeReplyTwo,
              remote.port,
              remote.address,
              function (err, bytes) {
                if (err) throw err;
                console.log(
                  `Data Frame Two Reply Sent: ${Buffer.from(
                    dataframeReply,
                    "ascii"
                  ).toString("hex")} bytes: ${bytes} sent to ${
                    remote.address
                  }:${remote.port}`
                );
              }
            );
          } else {
            await this.send(
              TimeFrameSend,
              remote.port,
              remote.address,
              function (err, bytes) {
                if (err) throw err;
                console.log(
                  `Time Frame Reply Sent: ${Buffer.from(
                    TimeFrameSend,
                    "ascii"
                  ).toString("hex")} bytes: ${bytes} sent to ${
                    remote.address
                  }:${remote.port}`
                );
              }
            );
          }

          //   } else if (message.length >= 500 && message.slice(24, 26) == 02) {
          //     this.send(
          //       dataframeReplyTwo,
          //       remote.port,
          //       remote.address,
          //       function (err, bytes) {
          //         if (err) throw err;
          //         console.log(
          //           `UDP message dataframe reply two: ${dataframeReplyTwo} bytes: ${bytes} sent to ${remote.address}:${remote.port}`
          //         );
          //       }
          //     );
          //   }
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

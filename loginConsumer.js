const amqp = require("amqplib/callback_api");
const axios = require("axios");

// *! header section of message
const header = "403A";
// console.log(header);

// *! tail section of message
const tail = "0D0A";
// console.log(tail);

amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    const queue = "loginframe";
    channel.assertQueue(queue, {
      durable: true,
    });
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(
      queue,
      function (msg) {
        if (msg.length <= 0) {
          console.log("no message in queue");
        } else {
          // ** intial payload Login Frame (send) message

          const intialPayloadLoginFrameSend = Buffer.from(
            msg.content
          ).toString();
          // console.log(
          //   intialPayloadLoginFrameSend,
          //   "intialPayloadLoginFrameSend"
          // );
          // console.log(intialPayloadLoginFrameSend.length);
          // ** start bit
          const startbitLoginFrameSend = header;
          // console.log(startbitLoginFrameSend);

          // ** Data section length L
          const datasectionLoginFrameSend = intialPayloadLoginFrameSend.slice(
            4,
            8
          );
          const datasectionLoginFrameSendAnalysis = parseInt(
            datasectionLoginFrameSend,
            16
          );
          // console.log("datasectionLoginFrameSend", datasectionLoginFrameSend);
          // console.log(
          //   "datasectionLoginFrameSendAnalysis",
          //   datasectionLoginFrameSendAnalysis
          // );

          // ** Client address A
          const clientAddressLoginFrameSend = intialPayloadLoginFrameSend.slice(
            8,
            20
          );
          // console.log("clientAddressLoginFrameSend", clientAddressLoginFrameSend);

          // ** Function code C
          const functionCodeLoginFrameSend = intialPayloadLoginFrameSend.slice(
            20,
            22
          );
          let functionCodeLoginFrameSendAnalysis;
          if (functionCodeLoginFrameSend === "01") {
            functionCodeLoginFrameSendAnalysis = "Client login";
          } else if (functionCodeLoginFrameSend === "08") {
            functionCodeLoginFrameSendAnalysis = "reporting of many meters";
          } else if (functionCodeLoginFrameSend === "09") {
            functionCodeLoginFrameSendAnalysis = "set/read client time";
          }
          // console.log("functionCodeLoginFrameSend", functionCodeLoginFrameSend);
          // console.log(
          //   "functionCodeLoginFrameSendAnalysis",
          //   functionCodeLoginFrameSendAnalysis
          // );

          // ** voltage
          const voltageLoginFrameSend = intialPayloadLoginFrameSend.slice(
            22,
            24
          );
          const voltageLoginFrameSendAnalysis =
            parseInt(voltageLoginFrameSend, 16) / 10;
          // console.log("voltageLoginFrameSend", voltageLoginFrameSend);
          // console.log("voltageLoginFrameSendAnalysis", voltageLoginFrameSendAnalysis);

          // ** Signal
          const signalLoginFrameSend = intialPayloadLoginFrameSend.slice(
            24,
            26
          );
          const signalLoginFrameSendAnalysis = parseInt(
            signalLoginFrameSend,
            16
          );
          // console.log("signalLoginFrameSend", signalLoginFrameSend);
          // console.log("signalLoginFrameSendAnalysis", signalLoginFrameSendAnalysis);

          // ** Date
          const dateLoginFrameSend = intialPayloadLoginFrameSend.slice(26, 38);
          // console.log("dateLoginFrameSend", dateLoginFrameSend);
          const dateslice = `20${dateLoginFrameSend.slice(
            0,
            2
          )}-${dateLoginFrameSend.slice(2, 4)}-${dateLoginFrameSend.slice(
            4,
            6
          )}T${dateLoginFrameSend.slice(6, 8)}:${dateLoginFrameSend.slice(
            8,
            10
          )}`;
          // console.log("dateSlice", dateslice);

          // ** Working mode
          const workingModeFrameSend = intialPayloadLoginFrameSend.slice(
            38,
            40
          );
          let workingModeFrameSendChoices;
          if (workingModeFrameSend === "00") {
            workingModeFrameSendChoices = "regular startup";
          } else if (workingModeFrameSend === "01") {
            workingModeFrameSendChoices = "real-time online.";
          }
          // console.log("workingModeFrameSend ", workingModeFrameSend);

          //**  Water meter quantity
          const waterMeterQuantityFrameSend = intialPayloadLoginFrameSend.slice(
            40,
            42
          );
          const waterMeterQuantityFrameSendAnalysis =
            waterMeterQuantityFrameSend * 1;
          // console.log("waterMeterQuantityFrameSend ", waterMeterQuantityFrameSend);
          // console.log(
          //   "waterMeterQuantityFrameSendAnalysis ",
          //   waterMeterQuantityFrameSendAnalysis
          // );

          //**  Station number
          const stationNumberFrameSend = intialPayloadLoginFrameSend.slice(
            42,
            44
          );
          // console.log("stationNumberFrameSend ", stationNumberFrameSend);

          //** Meter type
          const meterTypeFrameSend = intialPayloadLoginFrameSend.slice(44, 46);
          let meterTypeFrameSendAnalysis;
          if (meterTypeFrameSend === "84") {
            meterTypeFrameSendAnalysis =
              "SCL-61D stainless steel, with pressure";
          }
          // console.log("meterTypeFrameSend:", meterTypeFrameSend);
          // console.log("meterTypeFrameSendAnalysis:", meterTypeFrameSendAnalysis);

          // ** version number
          const versionNumberFrameSend = intialPayloadLoginFrameSend.slice(
            48,
            90
          );
          const versionNumberFrameSendAnalysis = Buffer.from(
            versionNumberFrameSend,
            "hex"
          ).toString("ascii");
          // console.log("versionNumberFrameSend:", versionNumberFrameSend);
          // console.log("versionNumberFrameSendAnalysis:", versionNumberFrameSendAnalysis);

          //**  Reporting cycle
          const reportingCycleFrameSend = intialPayloadLoginFrameSend.slice(
            92,
            94
          );
          const reportingCycleFrameSendAnalysis = parseInt(
            reportingCycleFrameSend,
            16
          );
          // todo: run more tests for more cases
          // console.log("reportingCycleFrameSend:", reportingCycleFrameSend);
          // console.log(
          //   "reportingCycleFrameSendAnalysis:",
          //   reportingCycleFrameSendAnalysis
          // );

          //**  Collecting cycle
          const collectingCycleFrameSend = intialPayloadLoginFrameSend.slice(
            96,
            100
          );
          const collectingCycleFrameSendAnalysis =
            parseInt(collectingCycleFrameSend, 16) / 60;
          // console.log("collectingCycleFrameSend:", collectingCycleFrameSend);
          // console.log(
          //   "collectingCycleFrameSendAnalysis:",
          //   collectingCycleFrameSendAnalysis
          // );

          //**  Meter’s serial number
          const meterSerialNumberFrameSend = intialPayloadLoginFrameSend.slice(
            100,
            130
          );
          // console.log("meterSerialNumberFrameSend:", meterSerialNumberFrameSend);

          //**  Reporting network parameter
          const reportingNetworkParameterFrameSend = intialPayloadLoginFrameSend.slice(
            130,
            148
          );

          // *? Byte length
          const reportingNetworkParameterFrameSendBytes =
            reportingNetworkParameterFrameSend.slice(2, 4) * 1;
          // console.log(
          //   "reportingNetworkParameterFrameSendBytes:",
          //   reportingNetworkParameterFrameSendBytes
          // );

          // *? ECL
          const reportingNetworkParameterFrameSendECL =
            reportingNetworkParameterFrameSend.slice(4, 6) * 1;
          // console.log(
          //   "reportingNetworkParameterFrameSendECL:",
          //   reportingNetworkParameterFrameSendECL
          // );

          // *? SNR
          const reportingNetworkParameterFrameSendSNR = reportingNetworkParameterFrameSend.slice(
            8,
            10
          );
          const reportingNetworkParameterFrameSendSNRAnalysis = parseInt(
            reportingNetworkParameterFrameSendSNR,
            16
          );
          // console.log(
          //   "reportingNetworkParameterFrameSendSNRAnalysis:",
          //   reportingNetworkParameterFrameSendSNRAnalysis
          // );

          // *? PCI
          const reportingNetworkParameterFrameSendPCI = reportingNetworkParameterFrameSend.slice(
            12,
            14
          );
          const reportingNetworkParameterFrameSendPCIAnalysis = parseInt(
            reportingNetworkParameterFrameSendPCI,
            16
          );
          // console.log(
          //   "reportingNetworkParameterFrameSendPCI:",
          //   reportingNetworkParameterFrameSendPCI
          // );
          // console.log(
          //   "reportingNetworkParameterFrameSendPCIAnalysis:",
          //   reportingNetworkParameterFrameSendPCIAnalysis
          // );

          // *? EARFCN
          const reportingNetworkParameterFrameSendEARFCN = reportingNetworkParameterFrameSend.slice(
            15,
            18
          );
          const reportingNetworkParameterFrameSendEARFCNAnalysis = parseInt(
            reportingNetworkParameterFrameSendEARFCN,
            16
          );
          // console.log(
          //   "reportingNetworkParameterFrameSendEARFCN:",
          //   reportingNetworkParameterFrameSendEARFCN
          // );
          // console.log(
          //   "reportingNetworkParameterFrameSendEARFCNAnalysis:",
          //   reportingNetworkParameterFrameSendEARFCNAnalysis
          // );

          //**  Check bit CS
          const checkBitParameterFrameSend = intialPayloadLoginFrameSend.slice(
            148,
            150
          );
          // console.log("checkBitParameterFrameSend", checkBitParameterFrameSend);

          //**  Stop bit
          const stopBitFrameSend = tail;
          // console.log("stopBitFrameSend:", stopBitFrameSend);

          const deviceTelemetry = {
            //*? login frame data
            clientAddressData: `${clientAddressLoginFrameSend}`,
            voltageData: voltageLoginFrameSendAnalysis,
            signalData: signalLoginFrameSendAnalysis,
            collectingTimeData: `${dateslice}`,
            reportingNetworkParametersECL: reportingNetworkParameterFrameSendECL,
            reportingNetworkParameterSNR: reportingNetworkParameterFrameSendSNRAnalysis,
            reportingNetworkParameterPCI: reportingNetworkParameterFrameSendPCIAnalysis,
            reportingNetworkParameterEARFCN: reportingNetworkParameterFrameSendEARFCNAnalysis,
          };

          const deviceTelemetryJson = JSON.stringify(deviceTelemetry, null, 3);
          const deviceTelemetryLoginProduction = JSON.stringify(
            deviceTelemetry
          );
          console.log(
            "production data (login frame): ",
            deviceTelemetryLoginProduction
          );
          // console.log(" [x] Received %s", msg.content.toString());

          if (deviceTelemetryLoginProduction) {
            //**  post to http endpoint
            axios
              .post(
                "https://bahari2dev.azurewebsites.net/api/Admin/LoginTelemetry",
                deviceTelemetryLoginProduction,

                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              )
              .then(
                (response) => {
                  console.log(
                    "responseDataLoginFrame after post request",
                    response.data
                  );
                  console.log("responseData Axios", response.status);
                },
                (error) => {
                  console.log("errorData Axios", error);
                }
              );
          } else {
            console.log("dont post");
          }
        }
      },
      {
        noAck: true,
      }
    );
  });
});

const express = require("express");
const fs = require("node:fs");
const path = require("node:path");
const axios = require("axios");
const PARSE = require("./parsingFunc");

const app = express();

const PORT = 3000;
const baseUrl = "https://app.navicmate.in/api/api_loc.php";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const convDateToLS = (date) => {
  return new Date(date).toLocaleString().replaceAll("/", "-");
};

const getYMD = (dt = new Date()) => {
  const now = new Date(dt);

  if (now.getTime() === 0) return "NA";

  const Y = String(now.getUTCFullYear()).padStart(2, "0");
  const M = String(now.getUTCMonth() + 1).padStart(2, "0");
  const D = String(now.getUTCDate()).padStart(2, "0");

  return Y + M + D;
};

const writeLog = (data) => {
  const logPath = path.join("logs");
  const logFile = path.join(logPath, `${getYMD()}.log`);

  if (!fs.existsSync(logPath)) fs.mkdirSync(logPath);

  fs.appendFileSync(logFile, data);
};

const createQuery = (data) => {
  const imei = data.imei;
  const alert = data.alertId;
  const dt = `${data.date}%20${data.time}`;
  const lat = data.lat;
  const lon = data.lon;
  const altitude = data.altitude;
  const angle = data.angle;
  const locValid = data.locValid;
  const speed = data.speed;
  const acc = data.ignition;
  const bats = data.mainpower;

  let query = `?imei=${imei}&dt=${dt}&lat=${lat}&lng=${lon}&altitude=${altitude}&angle=${angle}`;
  query += `&loc_valid=${locValid}&speed=${speed}&params=acc=${acc}|bats=${bats}|`;

  if (alert === "10") query += `panic=1|`;
  else if (alert === "11") query += `panic=0|`;
  else query += `panic=0|`;

  if (alert === "16") query += `wirecut=1|`; // wire cut
  else query += `wirecut=0|`; // wire cut

  if (alert === "22") query += `tilt=1|`; // tilt
  else query += `tilt=0|`; // tilt

  // if (alert === "23") query += `impact=1|`; // impact
  // else query += `impact=0|`; // impact

  // if (alert === "06") query += `pwrcut=1|`; // pwrcut
  // else query += `pwrcut=0|`; // pwrcut

  // if (alert === "03") query += `mainpwr=1|`; // mainpower
  // else query += `mainpwr=0|`; // mainpower

  return query;
};

app.post("/", async (req, res) => {
  try {
    const { vltdata } = req.body;

    if (!vltdata) {
      res.status(400);
      throw new Error("Missing vltdata in the request");
    }

    // Logs
    writeLog(`\n${convDateToLS(new Date())}\n${vltdata}\n`);

    let result = {};
    if (vltdata.startsWith("NRM")) {
      result = PARSE.parseNRM(vltdata);
    } else if (vltdata.startsWith("EPB")) {
      result = PARSE.parseEPB(vltdata);
    } else if (vltdata.startsWith("CRT")) {
      result = PARSE.parseCRT(vltdata);
    } else if (vltdata.startsWith("ALT")) {
      result = PARSE.parseALT(vltdata);
    } else if (vltdata.startsWith("BTH")) {
      result = PARSE.parseBTH(vltdata);

      result.packets = result.packets.sort((a, b) => {
        const centuary = new Date().getFullYear().toString().slice(0, 2);
        const aDT = new Date(`${centuary}${a.date}T${a.time}Z`);
        const bDT = new Date(`${centuary}${b.date}T${b.time}Z`);

        if (isNaN(aDT) || isNaN(bDT)) return 0;

        if (aDT > bDT) return 1;
        if (aDT < bDT) return -1;
        return 0;
      });

      const responses = [];
      for (const packet of result.packets) {
        const parsedData = {
          imei: result.imei,
          alert: packet.alerId,
          date: packet.date,
          time: packet.time,
          lat: packet.lat,
          lon: packet.lon,
          altitude: packet.altitude,
          angle: packet.heading,
          locValid: packet.gnssFix,
          speed: packet.speed,
          ignition: packet.ignition,
          mainpower: packet.mainpower,
        };

        const query = createQuery(parsedData);

        // Logs
        writeLog(`Request: GET | URL: ${baseUrl + query}\n\n`);

        const { data } = await axios.get(baseUrl + query);

        responses.push(data);
      }

      return res.status(200).json(responses);
    } else if (vltdata.startsWith("ACK")) {
      result = PARSE.parseACK(vltdata);
    } else if (vltdata.startsWith("FUL")) {
      result = PARSE.parseFUL(vltdata);
    } else if (vltdata.startsWith("HLM")) {
      result = PARSE.parseHLM(vltdata);

      result = {
        imei: result.imei,
        alert: "na",
        date: result.date,
        time: result.time,
        lat: "0",
        lon: "0",
        altitude: "0",
        angle: "0",
        locValid: "0",
        speed: "0",
        ignition: "0",
        mainpower: "na",
      };
    } else if (vltdata.startsWith("LGN")) {
      result = PARSE.parseLGN(vltdata);

      return res.json(result);
    } else throw new Error(`Unknown packet header: ${vltdata.slice(0, 3)}`);

    const parsedData = {
      imei: result.imei,
      alert: result.alerId,
      date: result.date,
      time: result.time,
      lat: result.lat,
      lon: result.lon,
      altitude: parseInt(result.altitude),
      angle: parseInt(result.heading),
      locValid: result.gnssFix || 0,
      speed: parseInt(result.speed),
      ignition: result.ignition,
      mainpower: result.mainPowerStatus,
    };

    const query = createQuery(parsedData);

    // Logs
    writeLog(`Request: GET | URL: ${baseUrl + query}\n\n`);

    const { data } = await axios.get(baseUrl + query);

    return res.status(200).json(data);
  } catch (err) {
    console.log(err);

    // Logs
    writeLog(`\nError: ${err.message} | ${err?.config?.url}\n`);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res
      .status(statusCode)
      .json({ error: err.message, stack: err.stack.split("\n") });
  }
});

app.all("*", async (req, res) =>
  res.status(200).send("<h1>Welcome to CDAC</h1>")
);

app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));

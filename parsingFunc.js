const fieldSizes = {
  header: 3,
  vendorId: 6,
  firmwareVersion: 6,
  vehicleRegNo: 16,
  endCharacter: 1,
  gnssFix: 1,
  date: 6,
  time: 6,
  lat: 10,
  latDir: 1,
  lon: 10,
  lonDir: 1,
  speed: 6,
  heading: 6,
  noOfSatellites: 2,
  altitude: 7,
  pdop: 2,
  hdop: 2,
  imei: 15,
  networkOperator: 6,
  gsmSignalStrength: 2,
  mcc: 3,
  mnc: 3,
  lac: 4,
  cellId: 9,
  nmr: 60,
  packetStatus: 1,
  ignition: 1,
  mainPowerStatus: 1,
  mainInputVoltage: 5,
  internalBatteryVoltage: 5,
  digitalIOStatus: 4,
  frameNumber: 6,
  checksum: 8,
  alertId: 2,
  vehicleMode: 1,
  batchLogCount: 3,
  geoFenceId: 5,
  dataUpdateRateIgnitionOn: 3,
  dataUpdateRateIgnitionOff: 3,
  batteryPercentage: 3,
  lowBatteryThresholdValue: 2,
  memoryPercentage: 3,
  analogInputStatus: 2,
  tamperAlert: 1,
  digitalIOStatus: 4, // Update with correct length
  activationKey: 16,
};

/*
Header, IMEI, Alert ID, Packet Status, GNSS Fix, Date, Time, Latitude,
Latitude Dir, Longitude, Longitude Dir, MCC, MNC, LAC, Cell ID, Speed,
Heading, No of Satellites, HDOP, GSM Signal Strength, Ignition,
Main Power Status, Vehicle Mode, Altitude, Network Operator Name
Eg: NRM12345678901234501L1060418102230023.125503N080.068033E404123
1234123456789070.48120.5025273011M0183.50BSNLXX
*/
const parseNRM = (packet) => {
  const fields = {
    header: fieldSizes.header,
    imei: fieldSizes.imei,
    alertId: fieldSizes.alertId,
    packetStatus: fieldSizes.packetStatus,
    gnssFix: fieldSizes.gnssFix,
    date: fieldSizes.date,
    time: fieldSizes.time,
    lat: fieldSizes.lat,
    latDir: fieldSizes.latDir,
    lon: fieldSizes.lon,
    lonDir: fieldSizes.lonDir,
    mcc: fieldSizes.mcc,
    mnc: fieldSizes.mnc,
    lac: fieldSizes.lac,
    cellId: fieldSizes.cellId,
    speed: fieldSizes.speed,
    heading: fieldSizes.heading,
    noOfSatellites: fieldSizes.noOfSatellites,
    hdop: fieldSizes.hdop,
    gsmSignalStrength: fieldSizes.gsmSignalStrength,
    ignition: fieldSizes.ignition,
    mainPowerStatus: fieldSizes.mainPowerStatus,
    vehicleMode: fieldSizes.vehicleMode,
    altitude: fieldSizes.altitude,
    networkOperator: fieldSizes.networkOperator,
  };

  let currentIndex = 0;
  const result = {};

  for (const field in fields) {
    const fieldLength = fields[field];
    result[field] = packet.substr(currentIndex, fieldLength);
    currentIndex += fieldLength;
  }

  result.date = parseDate(result.date);
  result.time = parseTime(result.time);
  result.networkOperator = result.networkOperator.replaceAll("X", "");

  return result;
};

/**
Header, IMEI, Alert ID, Packet Status, GNSS Fix, Date, Time, Latitude,
Latitude Dir, Longitude, Longitude Dir, MCC, MNC, LAC, Cell ID, Speed,
Heading, No of Satellites, HDOP, GSM Signal Strength, Ignition,
Main Power Status, Vehicle Mode, Altitude, Network Operator Name

Emergency ON Packet
Eg: EPB12345678901234510L1060418102230023.125503N080.068033E404123
1234123456789070.48120.5025273011M0183.50BSNLXX

Emergency OFF Packet
Eg: EPB12345678901234511L1060418102230023.125503N080.068033E404123
1234123456789070.48120.5025273011M0183.50BSNLXX
 */
const parseEPB = (packet) => {
  const fields = {
    header: fieldSizes.header,
    imei: fieldSizes.imei,
    alertId: fieldSizes.alertId,
    packetStatus: fieldSizes.packetStatus,
    gnssFix: fieldSizes.gnssFix,
    date: fieldSizes.date,
    time: fieldSizes.time,
    lat: fieldSizes.lat,
    latDir: fieldSizes.latDir,
    lon: fieldSizes.lon,
    lonDir: fieldSizes.lonDir,
    mcc: fieldSizes.mcc,
    mnc: fieldSizes.mnc,
    lac: fieldSizes.lac,
    cellId: fieldSizes.cellId,
    speed: fieldSizes.speed,
    heading: fieldSizes.heading,
    noOfSatellites: fieldSizes.noOfSatellites,
    hdop: fieldSizes.hdop,
    gsmSignalStrength: fieldSizes.gsmSignalStrength,
    ignition: fieldSizes.ignition,
    mainPowerStatus: fieldSizes.mainPowerStatus,
    vehicleMode: fieldSizes.vehicleMode,
    altitude: fieldSizes.altitude,
    networkOperator: fieldSizes.networkOperator,
  };

  let currentIndex = 0;
  const result = {};

  for (const field in fields) {
    const fieldLength = fields[field];
    result[field] = packet.substr(currentIndex, fieldLength);
    currentIndex += fieldLength;
  }

  result.date = parseDate(result.date);
  result.time = parseTime(result.time);
  result.networkOperator = result.networkOperator.replaceAll("X", "");

  return result;
};

/** 
Header, IMEI, Alert ID, Packet Status, GNSS Fix, Date, Time, Latitude,
Latitude Dir, Longitude, Longitude Dir, MCC, MNC, LAC, Cell ID, Speed,
Heading, No of Satellites, HDOP, GSM Signal Strength, Ignition,
Main Power Status, Vehicle Mode, Altitude, Network Operator Name,<<GF ID for Alert ID 20>>

Emergency button wire disconnect/wire-cut Alert Packet
The panic button wire-cut alert should be a continuous alert.
Header, IMEI, Alert ID, Packet Status, GNSS Fix, Date, Time, Latitude,
Latitude Dir, Longitude, Longitude Dir, MCC, MNC, LAC, Cell ID, Speed,
Heading, No of Satellites, HDOP, GSM Signal Strength, Ignition,
Main Power Status, Vehicle Mode, Altitude, Network Operator Name

Eg: CRT12345678901234516L1060418102230023.125503N080.068033E404123
1234123456789070.48120.5025273011M0183.50BSNLXX

Vehicle Battery Disconnect/ Main power Removal Alert Packet
Header, IMEI, Alert ID, Packet Status, GNSS Fix, Date, Time, Latitude,
Latitude Dir, Longitude, Longitude Dir, MCC, MNC, LAC, Cell ID, Speed,
Heading, No of Satellites, HDOP, GSM Signal Strength, Ignition,
Main Power Status, Vehicle Mode, Altitude, Network Operator Name

Eg: CRT12345678901234503L1060418102230023.125503N080.068033E404123
1234123456789070.48120.5025273011M0183.50BSNLXX

Overspeed Alert Packet
Header, IMEI, Alert ID, Packet Status, GNSS Fix, Date, Time, Latitude,
Latitude Dir, Longitude, Longitude Dir, MCC, MNC, LAC, Cell ID, Speed,
Heading, No of Satellites, HDOP, GSM Signal Strength, Ignition,
Main Power Status, Vehicle Mode, Altitude, Network Operator Name

Eg: CRT12345678901234517L1060418102230023.125503N080.068033E404123
1234123456789070.48120.5025273011M0183.50BSNLXX

Tilt Alert Packet
The tilt alert should be a continuous alert.
Header, IMEI, Alert ID, Packet Status, GNSS Fix, Date, Time, Latitude,
Latitude Dir, Longitude, Longitude Dir, MCC, MNC, LAC, Cell ID, Speed,
Heading, No of Satellites, HDOP, GSM Signal Strength, Ignition,
Main Power Status, Vehicle Mode, Altitude, Network Operator Name

Eg: CRT12345678901234522L1060418102230023.125503N080.068033E404123
1234123456789070.48120.5025273011M0183.50BSNLXX

Impact Alert Packet (Optional)
Header, IMEI, Alert ID, Packet Status, GNSS Fix, Date, Time, Latitude,
Latitude Dir, Longitude, Longitude Dir, MCC, MNC, LAC, Cell ID, Speed,
Heading, No of Satellites, HDOP, GSM Signal Strength, Ignition,
Main Power Status, Vehicle Mode, Altitude, Network Operator Name

Eg: CRT12345678901234523L1060418102230023.125503N080.068033E404123
1234123456789070.48120.5025273011M0183.50BSNLXX

Overspeed in Geofence Alert Packet
This alert should be generated when the vehicle is over-speeding in a geofence (Refer 8. Geofence)
Header, IMEI, Alert ID, Packet Status, GNSS Fix, Date, Time, Latitude,
Latitude Dir, Longitude, Longitude Dir, MCC, MNC, LAC, Cell ID, Speed,
Heading, No of Satellites, HDOP, GSM Signal Strength, Ignition,
Main Power Status, Vehicle Mode, Altitude, Network Operator Name, GF ID

Eg: CRT12345678901234520L1060418102230023.125503N080.068033E404123
1234123456789070.48120.5025273011M0183.50BSNLXX00001

*/
const parseCRT = (packet) => {
  const fields = {
    header: fieldSizes.header,
    imei: fieldSizes.imei,
    alertId: fieldSizes.alertId,
    packetStatus: fieldSizes.packetStatus,
    gnssFix: fieldSizes.gnssFix,
    date: fieldSizes.date,
    time: fieldSizes.time,
    lat: fieldSizes.lat,
    latDir: fieldSizes.latDir,
    lon: fieldSizes.lon,
    lonDir: fieldSizes.lonDir,
    mcc: fieldSizes.mcc,
    mnc: fieldSizes.mnc,
    lac: fieldSizes.lac,
    cellId: fieldSizes.cellId,
    speed: fieldSizes.speed,
    heading: fieldSizes.heading,
    noOfSatellites: fieldSizes.noOfSatellites,
    hdop: fieldSizes.hdop,
    gsmSignalStrength: fieldSizes.gsmSignalStrength,
    ignition: fieldSizes.ignition,
    mainPowerStatus: fieldSizes.mainPowerStatus,
    vehicleMode: fieldSizes.vehicleMode,
    altitude: fieldSizes.altitude,
    networkOperator: fieldSizes.networkOperator,
  };

  let currentIndex = 0;
  const result = {};

  for (const field in fields) {
    const fieldLength = fields[field];
    result[field] = packet.substr(currentIndex, fieldLength);
    currentIndex += fieldLength;
  }

  // Check if Geo Fence ID is present for Alert ID 20 (Overspeed in Geofence Alert Packet)
  if (result.alertId === "20") {
    result.geoFenceId = packet.substr(currentIndex, fieldSizes.geoFenceId);
  }

  result.date = parseDate(result.date);
  result.time = parseTime(result.time);
  result.networkOperator = result.networkOperator.replaceAll("X", "");

  return result;
};

/** 
Header, IMEI, Alert ID, Packet Status, GNSS Fix, Date, Time, Latitude,
Latitude Dir, Longitude, Longitude Dir, MCC, MNC, LAC, Cell ID, Speed,
Heading, No of Satellites, HDOP, GSM Signal Strength, Ignition,
Main Power Status, Vehicle Mode, Altitude, Network Operator Name, <<GF ID for Alert ID 18,19>>

Harsh Breaking Alert Packet
Header, IMEI, Alert ID, Packet Status, GNSS Fix, Date, Time, Latitude,
Latitude Dir, Longitude, Longitude Dir, MCC, MNC, LAC, Cell ID, Speed,
Heading, No of Satellites, HDOP, GSM Signal Strength, Ignition,
Main Power Status, Vehicle Mode, Altitude, Network Operator Name

Eg: ALT12345678901234513L1060418102230023.125503N080.068033E404123
1234123456789070.48120.5025273011M0183.50BSNLXX

Harsh Acceleration Alert Packet
Header, IMEI, Alert ID, Packet Status, GNSS Fix, Date, Time, Latitude,
Latitude Dir, Longitude, Longitude Dir, MCC, MNC, LAC, Cell ID, Speed,
Heading, No of Satellites, HDOP, GSM Signal Strength, Ignition,
Main Power Status, Vehicle Mode, Altitude, Network Operator Name

Eg: ALT12345678901234514L1060418102230023.125503N080.068033E404123
1234123456789070.48120.5025273011M0183.50BSNLXX

Rash Turning Alert Packet
Header, IMEI, Alert ID, Packet Status, GNSS Fix, Date, Time, Latitude,
Latitude Dir, Longitude, Longitude Dir, MCC, MNC, LAC, Cell ID, Speed,
Heading, No of Satellites, HDOP, GSM Signal Strength, Ignition,
Main Power Status, Vehicle Mode, Altitude, Network Operator Name

Eg: ALT12345678901234515L1060418102230023.125503N080.068033E404123
1234123456789070.48120.5025273011M0183.50BSNLXX

Vehicle Battery Reconnect/ Connect back to main battery Alert Packet
Header, IMEI, Alert ID, Packet Status, GNSS Fix, Date, Time, Latitude,
Latitude Dir, Longitude, Longitude Dir, MCC, MNC, LAC, Cell ID, Speed,
Heading, No of Satellites, HDOP, GSM Signal Strength, Ignition,
Main Power Status, Vehicle Mode, Altitude, Network Operator Name

Eg: ALT12345678901234506L1060418102230023.125503N080.068033E404123
1234123456789070.48120.5025273011M0183.50BSNLXX

Internal Battery Low Alert Packet
Header, IMEI, Alert ID, Packet Status, GNSS Fix, Date, Time, Latitude,
Latitude Dir, Longitude, Longitude Dir, MCC, MNC, LAC, Cell ID, Speed,
Heading, No of Satellites, HDOP, GSM Signal Strength, Ignition,
Main Power Status, Vehicle Mode, Altitude, Network Operator Name

Eg: ALT12345678901234504L1060418102230023.125503N080.068033E404123
1234123456789070.48120.5025273011M0183.50BSNLXX

Internal Low Battery Removed Alert Packet
Header, IMEI, Alert ID, Packet Status, GNSS Fix, Date, Time, Latitude,
Latitude Dir, Longitude, Longitude Dir, MCC, MNC, LAC, Cell ID, Speed,
Heading, No of Satellites, HDOP, GSM Signal Strength, Ignition,
Main Power Status, Vehicle Mode, Altitude, Network Operator Name

Eg: ALT12345678901234505L1060418102230023.125503N080.068033E404123
1234123456789070.48120.5025273011M0183.50BSNLXX

GNSS Box Opened Alert Packet
Header, IMEI, Alert ID, Packet Status, GNSS Fix, Date, Time, Latitude,
Latitude Dir, Longitude, Longitude Dir, MCC, MNC, LAC, Cell ID, Speed,
Heading, No of Satellites, HDOP, GSM Signal Strength, Ignition,
Main Power Status, Vehicle Mode, Altitude, Network Operator Name

Eg: ALT12345678901234509L1060418102230023.125503N080.068033E404123
1234123456789070.48120.5025273011M0183.50BSNLXX

Geofence Entry Alert Packet
This alert should be generated when the vehicle enters a geo fence
configured as Entry fence. If the vehicle exit from this type of
fence no need to provide Exit alert.(Refer 8. Geofence)
Header, IMEI, Alert ID, Packet Status, GNSS Fix, Date, Time, Latitude,
Latitude Dir, Longitude, Longitude Dir, MCC, MNC, LAC, Cell ID, Speed,
Heading, No of Satellites, HDOP, GSM Signal Strength, Ignition,
Main Power Status, Vehicle Mode, Altitude, Network Operator Name, GF ID

Eg: ALT12345678901234518L1060418102230023.125503N080.068033E404123
1234123456789070.48120.5025273011M0183.50BSNLXX00001

Geofence Exit Alert Packet
This alert should be generated when the vehicle exit a geo fence
configured as Exit fence. If the vehicle enters into this type of
fence no need to provide Entry alert. (Refer 8. Geofence)
Header, IMEI, Alert ID, Packet Status, GNSS Fix, Date, Time, Latitude,
Latitude Dir, Longitude, Longitude Dir, MCC, MNC, LAC, Cell ID, Speed,
Heading, No of Satellites, HDOP, GSM Signal Strength, Ignition,
Main Power Status, Vehicle Mode, Altitude, Network Operator Name, GF ID

Eg: ALT12345678901234519L1060418102230023.125503N080.068033E404123
1234123456789070.48120.5025273011M0183.50BSNLXX00002

*/
const parseALT = (packet) => {
  const fields = {
    header: fieldSizes.header,
    imei: fieldSizes.imei,
    alertId: fieldSizes.alertId,
    packetStatus: fieldSizes.packetStatus,
    gnssFix: fieldSizes.gnssFix,
    date: fieldSizes.date,
    time: fieldSizes.time,
    lat: fieldSizes.lat,
    latDir: fieldSizes.latDir,
    lon: fieldSizes.lon,
    lonDir: fieldSizes.lonDir,
    mcc: fieldSizes.mcc,
    mnc: fieldSizes.mnc,
    lac: fieldSizes.lac,
    cellId: fieldSizes.cellId,
    speed: fieldSizes.speed,
    heading: fieldSizes.heading,
    noOfSatellites: fieldSizes.noOfSatellites,
    hdop: fieldSizes.hdop,
    gsmSignalStrength: fieldSizes.gsmSignalStrength,
    ignition: fieldSizes.ignition,
    mainPowerStatus: fieldSizes.mainPowerStatus,
    vehicleMode: fieldSizes.vehicleMode,
    altitude: fieldSizes.altitude,
    networkOperator: fieldSizes.networkOperator,
  };

  let currentIndex = 0;
  const result = {};

  for (const field in fields) {
    const fieldLength = fields[field];
    result[field] = packet.substr(currentIndex, fieldLength);
    currentIndex += fieldLength;
  }

  // Check if Geo Fence ID is present for Alert ID 18 or 19
  if (result.alertId === "18" || result.alertId === "19") {
    result.geoFenceId = packet.substr(currentIndex, fieldSizes.geoFenceId);
  }

  result.date = parseDate(result.date);
  result.time = parseTime(result.time);
  result.networkOperator = result.networkOperator.replaceAll("X", "");

  return result;
};

/**
Header, IMEI, Batch Log Count,
(Alert ID, Packet Status, GNSS Fix, Date, Time, Latitude, Latitude Dir,
Longitude, Longitude Dir, MCC, MNC, LAC, Cell ID, Speed, Heading,
No of Satellites, HDOP, GSM Signal Strength, Ignition, Main Power Status,
Vehicle mode, <<Altitude, Network Operator Name for all Alert IDs except
Alert ID 25>>,
<<GF ID for Alert ID 18, 19, 20>>, <<Vendor ID , Firmware Version, Vehicle
Reg.No, Altitude, PDOP, Network Operator Name, NMR, Main Input Voltage,
Internal Battery Voltage, Tamper Alert, Digital Input Status, Digital
Output Status, Frame Number, Checksum for Alert ID 25>>) *
* Repeated ‘Batch Log Count’ times.
Eg:BTH12345678901234500301L1060418102230023.125503N080.068033E4041231234123
456789070.48120.5025273011M0183.50BSNLXX16H1060418102230023.125503N080.0680
33E4041231234123456789070.48120.5025273011M0183.50BSNLXX02H1060418102230023
.125503N080.068033E4041231234123456789070.48120.5025273011M0183.50BSNLXX
 */
const parseBTH = (packet) => {
  const batchStart = {
    header: fieldSizes.header,
    imei: fieldSizes.imei,
    batchLogCount: fieldSizes.batchLogCount,
  };
  let currentIndex = 0;
  const result = {};

  for (const field in batchStart) {
    const fieldLength = batchStart[field];
    result[field] = packet.substr(currentIndex, fieldLength);
    currentIndex += fieldLength;
  }

  result.batchLogCount = parseInt(result.batchLogCount, 10);

  result.packets = [];

  const fields = {
    alertId: fieldSizes.alertId,
    packetStatus: fieldSizes.packetStatus,
    gnssFix: fieldSizes.gnssFix,
    date: fieldSizes.date,
    time: fieldSizes.time,
    lat: fieldSizes.lat,
    latDir: fieldSizes.latDir,
    lon: fieldSizes.lon,
    lonDir: fieldSizes.lonDir,
    mcc: fieldSizes.mcc,
    mnc: fieldSizes.mnc,
    lac: fieldSizes.lac,
    cellId: fieldSizes.cellId,
    speed: fieldSizes.speed,
    heading: fieldSizes.heading,
    noOfSatellites: fieldSizes.noOfSatellites,
    hdop: fieldSizes.hdop,
    gsmSignalStrength: fieldSizes.gsmSignalStrength,
    ignition: fieldSizes.ignition,
    mainPowerStatus: fieldSizes.mainPowerStatus,
    vehicleMode: fieldSizes.vehicleMode,
  };

  const notAlert25Fields = {
    altitude: fieldSizes.altitude,
    networkOperator: fieldSizes.networkOperator,
  };

  const alert25Fields = {
    vendorId: fieldSizes.vendorId,
    firmwareVersion: fieldSizes.firmwareVersion,
    vehicleRegNo: fieldSizes.vehicleRegNo,
    altitude: fieldSizes.altitude,
    pdop: fieldSizes.pdop,
    networkOperator: fieldSizes.networkOperator,
    nmr: fieldSizes.nmr,
    mainInputVoltage: fieldSizes.mainInputVoltage,
    internalBatteryVoltage: fieldSizes.internalBatteryVoltage,
    tamperAlert: fieldSizes.tamperAlert,
    digitalIOStatus: fieldSizes.digitalIOStatus,
    frameNumber: fieldSizes.frameNumber,
    checksum: fieldSizes.checksum,
  };

  for (let i = 0; i < result.batchLogCount; i++) {
    const packetData = {};

    for (const field in fields) {
      const fieldLength = fields[field];
      packetData[field] = packet.substr(currentIndex, fieldLength);
      currentIndex += fieldLength;
    }

    if (packetData.alertId !== "25") {
      for (const field in notAlert25Fields) {
        const fieldLength = notAlert25Fields[field];
        packetData[field] = packet.substr(currentIndex, fieldLength);
        currentIndex += fieldLength;
      }
    }

    if (
      packetData.alertId === "18" ||
      packetData.alertId === "19" ||
      packetData.alertId === "20"
    ) {
      packetData.geoFenceId = packet.substr(
        currentIndex,
        fieldSizes.geoFenceId
      );
      currentIndex += fieldSizes.geoFenceId;
    } else if (packetData.alertId === "25") {
      for (const field in alert25Fields) {
        const fieldLength = alert25Fields[field];
        packetData[field] = packet.substr(currentIndex, fieldLength);
        currentIndex += fieldLength;
      }
    }

    packetData.date = parseDate(packetData.date);
    packetData.time = parseTime(packetData.time);
    packetData.networkOperator = packetData.networkOperator.replaceAll("X", "");

    result.packets.push(packetData);
  }

  return result;
};

/**
Header, IMEI, Alert ID, Packet Status, GNSS Fix, Date, Time, Latitude,
Latitude Dir, Longitude, Longitude Dir, MCC, MNC, LAC, Cell ID, Speed,
Heading, No of Satellites, HDOP, GSM Signal Strength, Ignition,
Main Power Status, Vehicle mode, Altitude, Network Operator Name,Key1:Value1, Key2:Value2,…,end character
Eg: ACK12345678901234512L1060418102230023.125503N080.068033E404123
1234123456789070.48120.5025273011M0183.50BSNLXXPU:10.0.0.1,SL:060.00,OU:10.0.0.0*
 */
const parseACK = (packet = "") => {
  const fields = {
    header: fieldSizes.header,
    imei: fieldSizes.imei,
    alertId: fieldSizes.alertId,
    packetStatus: fieldSizes.packetStatus,
    gnssFix: fieldSizes.gnssFix,
    date: fieldSizes.date,
    time: fieldSizes.time,
    lat: fieldSizes.lat,
    latDir: fieldSizes.latDir,
    lon: fieldSizes.lon,
    lonDir: fieldSizes.lonDir,
    mcc: fieldSizes.mcc,
    mnc: fieldSizes.mnc,
    lac: fieldSizes.lac,
    cellId: fieldSizes.cellId,
    speed: fieldSizes.speed,
    heading: fieldSizes.heading,
    noOfSatellites: fieldSizes.noOfSatellites,
    hdop: fieldSizes.hdop,
    gsmSignalStrength: fieldSizes.gsmSignalStrength,
    ignition: fieldSizes.ignition,
    mainPowerStatus: fieldSizes.mainPowerStatus,
    vehicleMode: fieldSizes.vehicleMode,
    altitude: fieldSizes.altitude,
    networkOperator: fieldSizes.networkOperator,
  };

  let currentIndex = 0;
  const result = {};

  for (const field in fields) {
    const fieldLength = fields[field];
    result[field] = packet.substr(currentIndex, fieldLength);
    currentIndex += fieldLength;
  }

  result.date = parseDate(result.date);
  result.time = parseTime(result.time);
  result.networkOperator = result.networkOperator.replaceAll("X", "");

  // Extract the dynamic part of the packet
  const remainingPacket = packet.substr(
    currentIndex,
    packet.length - currentIndex - fieldSizes.endCharacter
  );

  result.otaParameters = {};
  let i = 0;
  while (i < remainingPacket.length) {
    const keyEndIndex = remainingPacket.indexOf(":", i);
    const valueEndIndex = remainingPacket.indexOf(",", keyEndIndex + 1);

    const key = remainingPacket.substring(i, keyEndIndex);
    const value =
      valueEndIndex !== -1
        ? remainingPacket.substring(keyEndIndex + 1, valueEndIndex)
        : remainingPacket.substring(keyEndIndex + 1);

    result.otaParameters[key] = value;

    i = valueEndIndex !== -1 ? valueEndIndex + 1 : remainingPacket.length;
  }

  return result;
};

/**
Header, IMEI, Alert ID, Packet Status, GNSS Fix, Date, Time, Latitude,
Latitude Dir, Longitude, Longitude Dir, MCC, MNC, LAC, Cell ID, Speed,
Heading, No of Satellites, HDOP, GSM Signal Strength, Ignition,
Main Power Status, Vehicle Mode, Vendor ID, Firmware Version, Vehicle
Reg.No, Altitude, PDOP, Network Operator Name, NMR, Main Input Voltage,
Internal Battery Voltage, Tamper Alert, Digital I/O Status, Frame Number,
Checksum

Eg:FUL12345678901234525L1060418102230023.125503N080.068033E404123
1234123456789070.48120.5025273011MVENID11.1.00000000KL01AA55550183.5002OP
TNAM271234123456789281234123456789261234123456789251234123456789023.5003.
7C0001000001CHECKSUM
 */
const parseFUL = (packet) => {
  const fields = {
    header: fieldSizes.header,
    imei: fieldSizes.imei,
    alertId: fieldSizes.alertId,
    packetStatus: fieldSizes.packetStatus,
    gnssFix: fieldSizes.gnssFix,
    date: fieldSizes.date,
    time: fieldSizes.time,
    lat: fieldSizes.lat,
    latDir: fieldSizes.latDir,
    lon: fieldSizes.lon,
    lonDir: fieldSizes.lonDir,
    mcc: fieldSizes.mcc,
    mnc: fieldSizes.mnc,
    lac: fieldSizes.lac,
    cellId: fieldSizes.cellId,
    speed: fieldSizes.speed,
    heading: fieldSizes.heading,
    noOfSatellites: fieldSizes.noOfSatellites,
    hdop: fieldSizes.hdop,
    gsmSignalStrength: fieldSizes.gsmSignalStrength,
    ignition: fieldSizes.ignition,
    mainPowerStatus: fieldSizes.mainPowerStatus,
    vehicleMode: fieldSizes.vehicleMode,
    vendorId: fieldSizes.vendorId,
    firmwareVersion: fieldSizes.firmwareVersion,
    vehicleRegNo: fieldSizes.vehicleRegNo,
    altitude: fieldSizes.altitude,
    pdop: fieldSizes.pdop,
    networkOperator: fieldSizes.networkOperator,
    nmr: fieldSizes.nmr,
    mainInputVoltage: fieldSizes.mainInputVoltage,
    internalBatteryVoltage: fieldSizes.internalBatteryVoltage,
    tamperAlert: fieldSizes.tamperAlert,
    digitalIOStatus: fieldSizes.digitalIOStatus,
    frameNumber: fieldSizes.frameNumber,
    checksum: fieldSizes.checksum,
  };

  let currentIndex = 0;
  const result = {};

  for (const field in fields) {
    const fieldLength = fields[field];
    result[field] = packet.substr(currentIndex, fieldLength);
    currentIndex += fieldLength;
  }

  result.date = parseDate(result.date);
  result.time = parseTime(result.time);
  result.networkOperator = result.networkOperator.replaceAll("X", "");

  return result;
};

/*
Header, Vendor ID, Firmware Version, IMEI, Data update rate - Ignition ON,
Data update rate - Ignition OFF, Battery percentage, Low battery threshold value,
Memory percentage, Digital I/O status, Analog Input Status,Date, Time
Eg: HLMVENID11.1.0112345678901234500500109220060000110060418102230
 */
const parseHLM = (packet) => {
  const fields = {
    header: fieldSizes.header,
    vendorId: fieldSizes.vendorId,
    firmwareVersion: fieldSizes.firmwareVersion,
    imei: fieldSizes.imei,
    dataUpdateRateIgnitionOn: fieldSizes.dataUpdateRateIgnitionOn,
    dataUpdateRateIgnitionOff: fieldSizes.dataUpdateRateIgnitionOff,
    batteryPercentage: fieldSizes.batteryPercentage,
    lowBatteryThresholdValue: fieldSizes.lowBatteryThresholdValue,
    memoryPercentage: fieldSizes.memoryPercentage,
    digitalIOStatus: fieldSizes.digitalIOStatus,
    analogInputStatus: fieldSizes.analogInputStatus,
    date: fieldSizes.date,
    time: fieldSizes.time,
  };

  let currentIndex = 0;
  const result = {};

  for (const field in fields) {
    const fieldLength = fields[field];
    result[field] = packet.substr(currentIndex, fieldLength);
    currentIndex += fieldLength;
  }

  result.date = parseDate(result.date);
  result.time = parseTime(result.time);

  return result;
};

/**
Login/Activation Packet is defined to ensure that the data is
originated from device. The Login/Activation Packet should be
send from the device when an Activation SMS (Refer 9) is
received by the device. The length of the activation key will
be 16 bytes.

Header, IMEI, activationKey, Latitude, Latitude Dir, Longitude,
Longitude Dir, Date, Time, Speed

Eg:LGN123456789012345activationKey456023.125503N080.068033E060418102230070.48
 */
const parseLGN = (packet) => {
  const fields = {
    header: fieldSizes.header,
    imei: fieldSizes.imei,
    activationKey: fieldSizes.activationKey,
    lat: fieldSizes.lat,
    latDir: fieldSizes.latDir,
    lon: fieldSizes.lon,
    lonDir: fieldSizes.lonDir,
    date: fieldSizes.date,
    time: fieldSizes.time,
    speed: fieldSizes.speed,
  };

  let currentIndex = 0;
  const result = {};

  for (const field in fields) {
    const fieldLength = fields[field];
    result[field] = packet.substr(currentIndex, fieldLength);
    currentIndex += fieldLength;
  }

  return result;
};

const parseTime = (time) => {
  return `${time[0] + time[1]}:${time[2] + time[3]}:${time[4] + time[5]}`;
};

const parseDate = (date) => {
  return `${date[4] + date[5]}-${date[2] + date[3]}-${date[0] + date[1]}`;
};

module.exports = {
  parseNRM,
  parseEPB,
  parseCRT,
  parseALT,
  parseBTH,
  parseACK,
  parseFUL,
  parseHLM,
  parseLGN,
};

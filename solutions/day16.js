const utils = require("../utils.js");

module.exports = {
  solve: (inputFilePath) => {
    const binaryString = utils.parseInput(inputFilePath, parseHexToBinary);
    const topPacket = parsePacket(binaryString, 0);

    return [sumVersions(topPacket), topPacket.value];
  },
};

const HEX_MAP = {
  0: "0000",
  1: "0001",
  2: "0010",
  3: "0011",
  4: "0100",
  5: "0101",
  6: "0110",
  7: "0111",
  8: "1000",
  9: "1001",
  A: "1010",
  B: "1011",
  C: "1100",
  D: "1101",
  E: "1110",
  F: "1111",
};

function parseHexToBinary(hex) {
  let binary = "";
  for (let i in hex) {
    binary += HEX_MAP[hex[i]];
  }
  return binary;
}

function parsePacket(binaryString, startIndex) {
  let packet = { start: startIndex, subPackets: [] };

  let pointer = startIndex;
  packet.header = parseHeader(binaryString.slice(pointer, pointer + 6));
  pointer += 6;

  if (packet.header.type == 4) {
    // literal value packet
    let literalVal = "";
    while (binaryString[pointer] == 1) {
      literalVal += binaryString.slice(pointer + 1, pointer + 5);
      pointer += 5;
    }
    literalVal += binaryString.slice(pointer + 1, pointer + 5);
    pointer += 5;
    packet.end = pointer;
    packet.value = getDecimal(literalVal);
  } else {
    // operator packet
    lengthTypeId = binaryString[pointer];
    pointer++;
    if (lengthTypeId == 0) {
      let subPacketsTotalSize = getDecimal(
        binaryString.slice(pointer, pointer + 15)
      );
      pointer += 15;
      packet.end = pointer + subPacketsTotalSize;
      while (pointer < packet.end) {
        let subPacket = parsePacket(binaryString, pointer);
        packet.subPackets.push(subPacket);
        pointer = subPacket.end;
      }
    } else {
      let numSubPackets = getDecimal(binaryString.slice(pointer, pointer + 11));
      pointer += 11;
      for (let i = 0; i < numSubPackets; i++) {
        let subPacket = parsePacket(binaryString, pointer);
        packet.subPackets.push(subPacket);
        pointer = subPacket.end;
      }
    }
    packet.end = pointer;
    packet.value = applyOperation(packet.header.type, packet.subPackets);
  }

  return packet;
}

function parseHeader(binary) {
  return {
    version: getDecimal(binary.slice(0, 3)),
    type: getDecimal(binary.slice(3)),
  };
}

function getDecimal(binary) {
  let decimal = 0;
  let multiplier = 1;
  for (let i = binary.length - 1; i >= 0; i--) {
    if (binary[i] == 1) decimal += multiplier;
    multiplier *= 2;
  }
  return decimal;
}

function sumVersions(packet) {
  let sum = packet.header.version;
  packet.subPackets.forEach((sub) => {
    sum += sumVersions(sub);
  });
  return sum;
}

const OPERATIONS = {
  0: (packets) => sum(packets),
  1: (packets) => product(packets),
  2: (packets) => min(packets),
  3: (packets) => max(packets),
  5: (packets) => greaterThan(packets[0], packets[1]),
  6: (packets) => lessThan(packets[0], packets[1]),
  7: (packets) => equals(packets[0], packets[1]),
};

function sum(packets) {
  return packets.map((p) => p.value).reduce((a, b) => a + b);
}

function product(packets) {
  return packets.map((p) => p.value).reduce((a, b) => a * b);
}

function min(packets) {
  let min = Infinity;
  packets
    .map((p) => p.value)
    .forEach((val) => {
      if (val < min) min = val;
    });
  return min;
}

function max(packets) {
  let max = 0;
  packets
    .map((p) => p.value)
    .forEach((val) => {
      if (val > max) max = val;
    });
  return max;
}

function greaterThan(packet1, packet2) {
  return packet1.value > packet2.value ? 1 : 0;
}

function lessThan(packet1, packet2) {
  return packet1.value < packet2.value ? 1 : 0;
}

function equals(packet1, packet2) {
  return packet1.value == packet2.value ? 1 : 0;
}

function applyOperation(opcode, subPackets) {
  return OPERATIONS[opcode](subPackets);
}

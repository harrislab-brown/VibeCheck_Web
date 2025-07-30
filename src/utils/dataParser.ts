export interface DataPoint {
  channel: number;
  timestamp: number;
  x: number;
  y: number;
  z: number;
}
export interface XYZData {
  x:number;
  y:number;
  z:number;
}

export interface BufferData{
  0: XYZData[];
  1: XYZData[];
  2: XYZData[];
  

}

export interface ChannelData {
  channel: number;
  dataPoints: DataPoint[];
}


export interface Message {
  type: 'data' | 'event' | 'ack' | 'error';
  data: ChannelData[] | string;
}

export function parseSerialData(data: string): Message {
  const trimmedData = data.trim();
  
  if (trimmedData.startsWith('data')) {
    return {
      type: 'data',
      data: parseDataMessage(trimmedData)
    };
  } else if (trimmedData.startsWith('event')) {
    return {
      type: 'event',
      data: trimmedData.substring(6).trim()
    };
  } else if (trimmedData.startsWith('ack')) {
    return {
      type: 'ack',
      data: trimmedData.substring(4).trim()
    };
  } else if (trimmedData.startsWith('error')) {
    return {
      type: 'error',
      data: trimmedData.substring(6).trim()
    };
  }
  
  return {
    type: 'error',
    data: `Unknown message format: ${trimmedData}`
  };
}

function parseDataMessage(data: string): ChannelData[] {
  const tokens = data.split(' ');
  if (tokens[0] !== 'data') return [];

  //const transmissionType = parseInt(tokens[1], 10);
  const numDataPoints = parseInt(tokens[1], 10);
  
  const channelData: { [key: number]: ChannelData } = {};

  let tokenIndex = 2;
  for (let i = 0; i < numDataPoints; i++) {
    const channel = parseInt(tokens[tokenIndex], 10);
    const timestamp = parseInt(tokens[tokenIndex + 1], 10);
    const x = parseFloat(tokens[tokenIndex + 2]);
    const y = parseFloat(tokens[tokenIndex + 3]);
    const z = parseFloat(tokens[tokenIndex + 4]);

    const dataPoint: DataPoint = { channel, timestamp, x, y, z };

    if (!channelData[channel]) {
      channelData[channel] = { channel, dataPoints: [] };
    }
    channelData[channel].dataPoints.push(dataPoint);

    tokenIndex += 5; // Move to the next data point
  }

  return Object.values(channelData);
}

export function convertToCSV(channelData: ChannelData[]): string {
  let csv = '';
  
  for (const channel of channelData) {
    for (const dataPoint of channel.dataPoints) {
      csv += `${dataPoint.channel},${dataPoint.timestamp},${dataPoint.x},${dataPoint.y},${dataPoint.z}\n`;
    }
  }

  return csv;
}
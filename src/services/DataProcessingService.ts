import { ChannelData, DataPoint } from '../utils/dataParser';

export class DataProcessingService {
  private static instance: DataProcessingService;
  private data: ChannelData[] = [];

  private constructor() {}

  public static getInstance(): DataProcessingService {
    if (!DataProcessingService.instance) {
      DataProcessingService.instance = new DataProcessingService();
    }
    return DataProcessingService.instance;
  }

  public updateData(newData: ChannelData[]): void {
    this.data = newData;
  }

  public processData(
    channel: number,
    windowWidth: number,
    triggerChannel?: number,
    triggerAxis?: 'x' | 'y' | 'z',
    triggerLevel?: number,
    useTrigger: boolean = false
  ): DataPoint[] {
    const channelData = this.data.find((d) => d.channel === channel);
    if (!channelData) return [];

    let dataToDisplay = channelData.dataPoints;

    if (useTrigger && triggerChannel !== undefined && triggerAxis !== undefined && triggerLevel !== undefined) {
      const triggerData = this.data.find((d) => d.channel === triggerChannel);
      if (triggerData) {
        const triggerIndex = triggerData.dataPoints.findIndex((point) => point[triggerAxis] >= triggerLevel);
        if (triggerIndex !== -1) {
          const startIndex = Math.max(0, triggerIndex - Math.floor(windowWidth / 2));
          dataToDisplay = channelData.dataPoints.slice(startIndex, startIndex + windowWidth);
        }
      }
    } else {
      dataToDisplay = channelData.dataPoints.slice(-windowWidth);
    }

    return dataToDisplay;
  }
}

export default DataProcessingService;
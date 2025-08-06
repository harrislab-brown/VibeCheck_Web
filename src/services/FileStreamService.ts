export class FileStreamService {
    private static instance: FileStreamService;
    private outputDirectory: FileSystemDirectoryHandle | null = null;
    private fileHandle: FileSystemFileHandle | null = null;
    private writer: FileSystemWritableFileStream | null = null;
    private isRecording: boolean = false;
    private isClosing: boolean = false;
  
    private constructor() {}
  
    public static getInstance(): FileStreamService {
        if (!FileStreamService.instance) {
          FileStreamService.instance = new FileStreamService();
        }
        return FileStreamService.instance;
      }
  
    setOutputDirectory(directory: FileSystemDirectoryHandle) {
      this.outputDirectory = directory;
    }
  
    async startRecording(filename: string) { 
      if (!this.outputDirectory) {
        throw new Error('Output directory not set');
      }
  
      this.fileHandle = await this.outputDirectory.getFileHandle(filename, { create: true });
      this.writer = await this.fileHandle.createWritable();
      this.isRecording = true; //this triggers something that is started when connect is pressed
      this.writeToFile('Channel,Timestamp,X,Y,Z\n'); // set first line of file as descriptive header
      this.isClosing = false; 
    }
  
    async stopRecording() {
      if (this.writer && !this.isClosing) {
        this.isClosing = true;
        try{
          await this.writer.close();

        }catch (error){
          console.error('Error closing file:', error);
        }finally{
          this.writer = null;
          this.isClosing = false;
        }
      }
      this.isRecording = false;
    }
  
    async writeToFile(data: string) {
      if (!this.isRecording || !this.writer || this.isClosing) {
        return; // Don't write if not recording
      }
      await this.writer.write(data);
    }
  
    public getIsRecording(): boolean {
      return this.isRecording;
    }
  }
export class dataBuffer{

DBuffer = new Array(100).fill(0)
private available: number = 0
private read: number = 0
private dataOutput: string = ''

//I guess I need a constructor, I can construct in the store like middleware
async readData(){
if (this.available != this.read){
    this.dataOutput = this.DBuffer[this.read]
    this.read = (1+ this.read)%100

    return(this.dataOutput)
}
//should probably do something if there isnt data to read, just not sure exactly what
}

async writeData(data:string){

    this.DBuffer[this.available] = data
    this.available = (1+ this.available)%100

}


}
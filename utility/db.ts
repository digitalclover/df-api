import { VideoDetails } from "../scrapeForNewVideos";

export class DFDB {
  private state: Map<string, VideoDetails>;
  constructor(){
    this.state = new Map();
  }
  public set(data:VideoDetails[] | VideoDetails){
    const toSet = Array.isArray(data) ? data : [data];
    toSet.map(item=>this.state.set(item.title, item));
  }
  public getAll(){
    return [...this.state.values()];
  }
}
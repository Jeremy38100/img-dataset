export abstract class Scrapper {

  search: string;
  nbImages: number;
  types: string[];
  lastPushedIndex = 0;

  constructor(search: string, nbImages: number, types: string[]) {
    this.search = search;
    this.nbImages = nbImages;
    this.types = types;
  }

  abstract init(): Promise<any>
  abstract getLinks(): Promise<any>
  abstract end(): Promise<any>
}
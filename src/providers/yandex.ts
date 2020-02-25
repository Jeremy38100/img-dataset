import { Scrapper } from "../scrapper";
import { launch, Browser, Page } from "puppeteer";

export class YandexProvider extends Scrapper {

  browser!: Browser;
  page!: Page;
  links: string[] = [];

  constructor(search: string, nbImages: number, types: string[]) {
   super(search, nbImages, types);
  }

  private getUrl() {
    let url = `https://yandex.com/images/search?text=${this.search}`;
    if (this.types.length === 1) {
      url += '&itype=' + this.types[0];
    }
    return url
  }

  async init() {
    this.browser = await launch({
      headless: true,
      args:[
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--single-process'
      ],
    });
    this.page = await this.browser.newPage();
    await this.page.goto(this.getUrl());
    await this.page.waitForSelector('.serp-item');
  }

  async end() {
    this.browser?.close();
  }

  async getLinks(): Promise<string[]> {
    const newLinks = await this.getLinksFrom(0, this.nbImages); // TODO get from
    newLinks.length = this.nbImages;
    this.links = newLinks;
    return this.links;
  }

  private async getPageLinks(): Promise<string[]> {
    const links = await this.page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('.serp-item'));
      const links: string[] = elements
        .map(e => {
          try {
            const data = JSON.parse(e.getAttribute('data-bem') || '{}');
            return data['serp-item']['img_href'];
          } catch (e) { return ''; }
        })
        ;
      return links;
     });
     return links.filter(link => {
       for (const type of this.types) {
        if (link.endsWith('.' + type)) return true;
       }
       return false;
     })
  }

  private async getLinksFrom(indexFrom: number, nb: number): Promise<string[]> {
    while ((await this.getPageLinks()).length < indexFrom + nb) await this.scroll();
    const links = await this.getPageLinks()
    return links.splice(indexFrom, nb);
  }

  private async scroll() {
    await this.page.evaluate(_ => window.scrollBy(0, window.innerHeight));
  }
}
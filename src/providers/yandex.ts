import { Scrapper } from "../scrapper";
import { launch, Browser, Page } from "puppeteer";

export class YandexProvider extends Scrapper {

  browser!: Browser;
  page!: Page;
  links: string[] = [];

  constructor(search: string, nbImages: number, types: string[]) {
   super(search, nbImages, types);
  }

  async init() {
    this.browser = await launch({headless: true});
    this.page = await this.browser.newPage();
    await this.page.goto(`https://yandex.com/images/search?text=${this.search}`);
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

  async countPageLinks(): Promise<number> {
    return this.page.evaluate(() =>
      Array.from(document.querySelectorAll('.serp-item')).length
    );
  }

  async getPageLinks(): Promise<string[]> {
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

  async getLinksFrom(indexFrom: number, nb: number): Promise<string[]> {
    while (await this.countPageLinks() < indexFrom + nb) await this.scroll();
    const links = await this.getPageLinks()
    return links.splice(indexFrom, nb);
  }

  async scroll() {
    await this.page.evaluate(_ => window.scrollBy(0, window.innerHeight));
  }
}
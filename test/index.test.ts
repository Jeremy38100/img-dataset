import { expect } from 'chai';
import * as fs from 'fs';
import { downloadImage } from '../src/downloader';
import { Scrapper } from '../src/scrapper';
import { YandexProvider } from '../src/providers/yandex';
import { getName } from '../src/name';

function isFile(path: string): boolean {
  try {
    if (fs.existsSync(path)) return true;
  } catch(err) { }
  return false;
}


describe('download', () => {

  const PATH = 'test/images/';

  // TODO: not working on Travis
  // it(`should succeed`, async () => {
  //   const url = 'https://i.ytimg.com/vi/vswXw0r5fQE/maxresdefault.jpg';
  //   const isSucceed = await downloadImage(url, 'succeed.jpg', PATH);
  //   expect(isSucceed).to.be.eq(true);
  //   expect(isFile(PATH + 'succeed.jpg')).to.be.eq(true);
  // })

  it(`should failed`, async () => {
    const url = 'https://fnejfnejfnezjkfezfkez.com/renj.jpg';
    const isSucceed = await downloadImage(url, 'failed.jpg', PATH);
    expect(isSucceed).to.be.eq(false);
    expect(isFile(PATH + 'failed.jpg')).to.be.eq(false);
  })
})

describe('scrapper Yandex', () => {
  it ('should get 2 links', async () => {
    const nbImages = 2;
    const scrapper: Scrapper = new YandexProvider('cat', nbImages, ['jpg']);
    await scrapper.init();
    const links: string[] = await scrapper.getLinks();
    await scrapper.end();

    expect(links.length).to.be.eq(nbImages);
    expect(links.every(l => l.endsWith('.jpg'))).to.be.eq(true);
  })

  it ('should get 200 links', async () => {
    const nbImages = 200;
    const scrapper: Scrapper = new YandexProvider('cat', nbImages, ['jpg']);
    await scrapper.init();
    const links: string[] = await scrapper.getLinks();
    await scrapper.end();

    expect(links.length).to.be.eq(nbImages);
    expect(links.every(l => l.endsWith('.jpg'))).to.be.eq(true);
  })
});

describe('name', () => {
  it ('should generate name', async () => {
    expect(getName('https://tfgvbhjnk.fgh.com/ok.jpg', 'image', 2)).to.be.eq('image_2.jpg')
  })
})
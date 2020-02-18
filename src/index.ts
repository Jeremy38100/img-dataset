#!/usr/bin/env node
import { YandexProvider } from './providers/yandex';

import { getTypes, getNb, getLocation, getSearchItems } from "./arguments";
import { Scrapper } from "./scrapper";
import { downloadImage } from './downloader';
import { getName } from './name';
import { createFolder } from './folder';


(async () => {
  const searchItems = getSearchItems();
  const types = getTypes();
  const nb = getNb();
  const location = getLocation();

  createFolder(location);

  for (const search of searchItems) {
    const scrapper: Scrapper = new YandexProvider(search, nb, types);
    await scrapper.init();
    const links: string[] = await scrapper.getLinks();
    createFolder(location + search);
    const imagesLocation = location + search + '/';
    await Promise.all(links.map((link, index) => downloadImage(link, getName(link, search, index), imagesLocation)))
    await scrapper.end();
  }

})();
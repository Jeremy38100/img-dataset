#!/usr/bin/env node
import { YandexProvider } from './providers/yandex';

import { getTypes, getNb, getLocation, getSearchItems } from "./arguments";
import { Scrapper } from "./scrapper";
import { downloadImage } from './downloader';
import { getName } from './name';
import { createFolder } from './folder';
import { blue } from 'chalk';
import * as cliProgress from 'cli-progress';

(async () => {
  const searchItems = getSearchItems();
  const types = getTypes();
  const nb = getNb();
  const location = getLocation();

  createFolder(location);

  for (const search of searchItems) {
    createFolder(location + search);
    console.log(blue(`${search}: Fetching links`));
    const progressBar = new cliProgress.SingleBar({
      format: `Download ${search} {value}/{total} | [{bar}]`
    }, cliProgress.Presets.shades_classic);
    const scrapper: Scrapper = new YandexProvider(search, nb, types);
    await scrapper.init();
    const links: string[] = await scrapper.getLinks();

    progressBar.start(links.length, 0)
    const imagesLocation = location + search + '/';
    await Promise.all(links.map((link, index) => downloadImage(link, getName(link, search, index), imagesLocation, progressBar)))
    await scrapper.end();
    progressBar.stop()
  }

})();
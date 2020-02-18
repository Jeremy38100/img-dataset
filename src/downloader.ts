import * as fs from 'fs';
import Axios from 'axios';

export async function downloadImage(url: string, name: string, path: string = './'): Promise<boolean> {
  try {
    const response = await Axios({
      method: 'get',
      responseType: 'stream',
      url,
    });
    response.data.pipe(fs.createWriteStream(path + name));
    return true;
  } catch (e) {
    return false;
  }
}
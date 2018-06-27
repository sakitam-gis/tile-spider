import * as fs from 'fs';
import * as Canvas from 'canvas';
import axios from 'axios';
import { resolve, checkFolderExist } from '../index';
const errorTile = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxOWUzZTA0YS1lOWFjLTljNDctODI5ZS0yMjM3YTQ3YzU3MzciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MUU5MjRFQkZCOTQxMTFFMzlDQjA5NkM1REQ1MEUwODciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MUU5MjRFQkVCOTQxMTFFMzlDQjA5NkM1REQ1MEUwODciIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmU5MjNlNDE0LWNlOTktMzk0My1hZjRjLTgwZjhiOGY1MjY0NCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxOWUzZTA0YS1lOWFjLTljNDctODI5ZS0yMjM3YTQ3YzU3MzciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz54esASAAAAEElEQVR42mL4//8/A0CAAQAI/AL+26JNFgAAAABJRU5ErkJggg==';

class Tile {
  x: number;
  y: number;
  z: number;
  id: string;
  url: string;
  isLoad: boolean;
  tile: any;
  reTry: number;
  constructor (url, x, y, z, id) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.id = id;
    this.url = url;
    this.reTry = 0; // max 3
  }

  /**
   * load tile
   * @private
   */
  _loadTile () {
    const canvas = new Canvas(256, 256);
    const ctx = canvas.getContext('2d');
    this.isLoad = false;
    this.reTry++;
    return new Promise((resolv, reject) => {
      axios({
        method: 'get',
        url: this.url,
        responseType: 'arraybuffer'
      }).then((response) => {
        checkFolderExist(resolve(`../images/${this.z}`), true);
        checkFolderExist(resolve(`../images/${this.z}/${this.x}`), true);
        const img = new Image();
        img.src = response.data;
        img.width = 256;
        img.height = 256;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        canvas.createPNGStream().pipe(fs.createWriteStream(resolve(`../images/${this.z}/${this.x + '/' + this.y}.png`)));
        this.isLoad = true;
        resolv(img);
      }).catch(error => {
        const img = new Image();
        img.src = errorTile;
        img.width = 256;
        img.height = 256;
        // ctx.drawImage(img, 0, 0, img.width, img.height);
        // canvas.createPNGStream().pipe(fs.createWriteStream(resolve(`../images/${this.z}/${this.x + '/' + this.y}.png`)));
        resolv(img);
        // if (this.reTry < 4) {
        //   // this._loadTile();
        // } else {
        // }
      });
    });
  }

  /**
   * 是否加载完毕
   * @returns {boolean}
   */
  isLoaded () {
    return this.isLoad;
  }

  /**
   * get image
   * @returns {Image|HTMLImageElement}
   */
  getImage () {
    return this.tile;
  }

  /**
   * set image
   * @param image
   */
  setImage (image) {
    this.tile = image;
  }

  /**
   * set x, y, z
   * @param x
   * @param y
   * @param z
   * @returns {Tile}
   */
  setXYZ (x, y, z) {
    if (this.x !== x || this.y !== y || this.z !== z) {
      this.x = x;
      this.y = y;
      this.z = z;
      this._loadTile();
    }
    return this;
  }

  /**
   * set url
   * @param url
   * @returns {Tile}
   */
  setUrl (url) {
    if (this.url !== url) {
      this.url = url;
      this._loadTile();
    }
    return this;
  }

  /**
   * set id
   * @param id
   * @returns {Tile}
   */
  setId (id) {
    if (this.id !== id) {
      this.id = id;
      this._loadTile();
    }
    return this;
  }

  /**
   * set tile option
   * @param options
   */
  setOptions (options = {}) {
    this.x = options['x'];
    this.y = options['y'];
    this.z = options['z'];
    this.id = options['id'];
    this.url = options['url'];
    this._loadTile();
  }

  /**
   * 获取error Tile
   * @returns {string}
   */
  getErrorTile () {
    return errorTile;
  }
}

export default Tile;

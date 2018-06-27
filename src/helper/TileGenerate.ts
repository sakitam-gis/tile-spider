import * as fs from 'fs';
import Tile from './Tile/Tile';
import Base from './Tile/Base';
import * as Canvas from 'canvas';
import { isFunction, resolve, loadImage } from './index';

class TileLayer extends Base {
  url: any;
  tileSize: Array<number>;
  tiles: Array<any>;
  size: Array<number>;
  center: Array<number>;
  zoom: number;
  canvas: Canvas;
  context: any;
  callback: Function;
  resolution: number;
  resolutions: Array<number>;
  constructor (options = {}) {
    super(options);

    /**
     * layer service url
     * @type {*|string}
     */
    this.url = options['url'] || '';

    /**
     * tile size
     * @type {*|number[]}
     */
    this.tileSize = options['tileSize'] || [256, 256];

    /**
     * 切片缓存
     * @type {Array}
     */
    this.tiles = [];

    /**
     * resolutions
     */
    this.resolutions = options['resolutions'] || this.projection.getResolutions();

    this.resolution = options['resolution'] || this.resolutions[0];

    this.zoom = this.getNearestZoom(false);

    this.center = [(this.extent[2] - this.extent[0]) / 2, (this.extent[3] - this.extent[1]) / 2];

    this.size = [(this.extent[2] - this.extent[0]) / this.resolution, (this.extent[3] - this.extent[1]) / this.resolution];

    this.canvas = new Canvas(this.size[0] || 500, this.size[1] || 500);

    this.context = this.canvas.getContext(options['context'] || '2d');

    this.callback = options['callback'] || function () {};
  }

  /**
   * get pixel from coordinates
   * @param coordinates
   * @returns {*[]}
   */
  getPixelFromCoordinate (coordinates) {
    const size = this.size;
    const halfSize = [size[0] / 2, size[1] / 2];
    const center = this.center;
    const resolution = this.resolution;
    return [
      halfSize[0] + (coordinates[0] - center[0]) / resolution,
      halfSize[1] - (coordinates[1] - center[1]) / resolution
    ];
  }

  /**
   * re render
   */
  render () {
    const size = this.size;
    const center = this.center;
    const layerResolution = this.resolution;
    const tiles = this._getTilesInternal();
    this.setExtent([
      center[0] - size[0] * layerResolution / 2,
      center[1] - size[1] * layerResolution / 2,
      center[0] + size[0] * layerResolution / 2,
      center[1] + size[1] * layerResolution / 2
    ]);
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];
      const tileResolution = this.resolution;
      const tileExtent = [
        this.origin[0] + tile.x * this.tileSize[0] * tileResolution,
        this.origin[1] - (tile.y + 1) * this.tileSize[1] * tileResolution,
        this.origin[0] + (tile.x + 1) * this.tileSize[0] * tileResolution,
        this.origin[1] - tile.y * this.tileSize[1] * tileResolution
      ];
    }
    const centerTile = this._getTileIndex(center[0], center[1], this.zoom);
    this._sortTiles(tiles, centerTile);
    return this._getTiles(tiles);
  }

  /**
   * draw tile
   * @param tile
   * @private
   */
  _drawTile (tile) {
    return new Promise((resolve1, reject) => {
      const resolution = this.resolution;
      const x = this.origin[0] + parseInt(tile['x']) * this.tileSize[0] * resolution;
      const y = this.origin[1] - parseInt(tile['y']) * this.tileSize[1] * resolution;
      const [width, height] = [this.tileSize[0], this.tileSize[1]];
      const [idxMax, idxMin] = [0, 0];
      const mapWidth = this.size[0];
      for (let i = idxMin; i <= idxMax; i++) {
        const pixel = this.getPixelFromCoordinate([x + i * mapWidth, y]);
        const [pixelX, pixelY] = [pixel[0], pixel[1]];
        try {
          this.context.drawImage(tile.getImage(), Math.round(pixelX), Math.round(pixelY), width, height);
          resolve1(true);
        } catch (e) {
        }
      }
    });
  }

  /**
   * get tile
   * @param tiles
   * @returns {Array}
   * @private
   */
  async _getTiles (tiles) {
    this.context.save();
    this.context.globalAlpha = this.getOpacity();
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];
      const canvasTile = new Tile(tile.url, tile.x, tile.y, tile.z, tile.id);
      const _image = await canvasTile._loadTile();
      canvasTile.setImage(_image);
      const flag = await this._drawTile(canvasTile);
      if (flag) {
        this.tiles.push(canvasTile);
      }
    }
    this.context.restore();
    this.canvas.createPNGStream().pipe(fs.createWriteStream(resolve(`../images/${this.zoom}.png`)));
    return this.tiles;
  }

  /**
   * sort tiles
   * @param tiles
   * @param centerTile
   * @private
   */
  _sortTiles (tiles, centerTile) {
    tiles.sort((a, b) => {
      const indexX = Math.pow((a[0] - centerTile[0]), 2) + Math.pow((a[1] - centerTile[1]), 2);
      const indexY = Math.pow((b[0] - centerTile[0]), 2) + Math.pow((b[1] - centerTile[1]), 2);
      return Math.abs(indexX - indexY);
    });
  }

  /**
   * get tiles
   * @returns {Array}
   * @private
   */
  _getTilesInternal () {
    const size = this.size;
    const center = this.center;
    const mapResolution = this.resolution;
    const resolutions = this.resolutions;
    const zoom = this.zoom;
    const layerResolution = resolutions[zoom];
    const scale = layerResolution / mapResolution;
    const scaledTileSize = [this.tileSize[0] * scale, this.tileSize[1] * scale];
    const width = Math.abs(size[0] * Math.cos(0)) + Math.abs(size[1] * Math.sin(0));
    const height = Math.abs(size[0] * Math.sin(0)) + Math.abs(size[1] * Math.cos(0));
    const centerTile = this._getTileIndex(center[0], center[1], zoom);
    const tileLeft = centerTile[0] - Math.ceil(width / scaledTileSize[0] / 2);
    const tileRight = centerTile[0] + Math.ceil(width / scaledTileSize[0] / 2);
    const tileBottom = centerTile[1] - Math.ceil(height / scaledTileSize[1] / 2);
    const tileTop = centerTile[1] + Math.ceil(height / scaledTileSize[1] / 2);
    const _tiles = [];
    for (let i = tileLeft; i <= tileRight; i++) {
      for (let j = tileBottom; j <= tileTop; j++) {
        const tileExtent = [
          this.origin[0] + i * this.tileSize[0] * layerResolution,
          this.origin[1] - (j + 1) * this.tileSize[1] * layerResolution,
          this.origin[0] + (i + 1) * this.tileSize[0] * layerResolution,
          this.origin[1] - j * this.tileSize[1] * layerResolution
        ];
        const url = this._getTileUrl(i, j, zoom);
        _tiles.push({
          z: zoom,
          x: i,
          y: j,
          id: zoom + ',' + i + ',' + j,
          url: url,
          size: scaledTileSize,
          extent: tileExtent,
          resolution: layerResolution
        });
      }
    }
    return _tiles;
  }

  /**
   * get tile show extent
   * @param idxX
   * @param idxY
   * @param zoom
   * @returns {*[]}
   * @private
   */
  _getTileExtent (idxX, idxY, zoom) {
    const resolutions = this.resolutions;
    const resolution = Number(resolutions[zoom]);
    if (!resolution) {
      return [];
    }
    const dx = this.tileSize[0] * resolution * idxX;
    const dy = this.tileSize[1] * resolution * idxY;
    const x = dx + this.origin[0];
    const y = this.origin[1] - dy;
    return [x, y - this.tileSize[1] * resolution, x + this.tileSize[0] * resolution, y];
  }

  /**
   * get tile index
   * @param x
   * @param y
   * @param zoom
   * @returns {*[]}
   * @private
   */
  _getTileIndex (x, y, zoom) {
    const resolutions = this.resolutions;
    const resolution = Number(resolutions[zoom]);
    if (!resolution) {
      return [-1, -1];
    }
    const dx = x - this.origin[0];
    const dy = this.origin[1] - y;
    return [Math.floor(dx / (this.tileSize[0] * resolution)), Math.floor(dy / (this.tileSize[1] * resolution))];
  }

  /**
   * get each tile url
   * @param idxX
   * @param idxY
   * @param zoom
   * @returns {*}
   * @private
   */
  _getTileUrl (idxX, idxY, zoom) {
    if (isFunction(this.url)) {
      return this.url(zoom, idxX, idxY);
    } else {
      return this.url.replace('{z}', zoom).replace('{x}', idxX).replace('{y}', idxY);
    }
  }

  /**
   * get current nearest zoom
   * @param greater
   * @returns {number}
   */
  getNearestZoom (greater) {
    const resolution = this.resolution;
    const resolutions = this.resolutions;
    let [newResolution, lastZoom] = [undefined, 0];
    for (let i = 0, length = resolutions.length; i < length; i++) {
      newResolution = resolutions[i];
      if (resolution > newResolution) {
        return greater ? i : lastZoom;
      } else if (resolution <= newResolution && resolution > newResolution) {
        return i;
      } else {
        lastZoom = i;
      }
    }
    return 0;
  }
}

export default TileLayer;

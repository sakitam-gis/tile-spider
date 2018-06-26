import Base from './Tile/Base';
import { isFunction } from './index';

class TileLayer extends Base {
  url: any;
  tileSize: Array<number>;
  tiles: Array<number>;
  origin: Array<number>;
  size: Array<number>;
  center: Array<number>;
  resolution: number;
  extent: Array<number>;
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

    this.resolution = options['resolution'] || 0;

    this.extent = options['extent'] || [];

    this.center = [(this.extent[2] - this.extent[0]) / 2, (this.extent[3] - this.extent[1]) / 2];

    this.size = [(this.extent[2] - this.extent[0]) / this.resolution, (this.extent[3] - this.extent[1]) / this.resolution];
  }

  /**
   * load layer
   * @returns {TileLayer}
   */
  load () {
    this.render();
    return this;
  }

  /**
   * re render
   */
  render () {
    const size = this.size;
    const center = this.center;
    const layerResolution = this.resolution;
    let tiles = this._getTilesInternal();
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
    const centerTile = this._getTileIndex(center[0], center[1], zoom);
    this._sortTiles(tiles, centerTile);
  }

  /**
   * draw tile
   * @param tile
   * @param context
   * @private
   */
  _drawTile (tile, context) {
    if (!tile.isLoaded()) {
      return;
    }
    const size = this.size;
    const center = this.center;
    const layerResolution = this.resolution;
    let x = this.origin[0] + parseInt(tile['x']) * this.tileSize[0] * layerResolution;
    let y = this.origin[1] - parseInt(tile['y']) * this.tileSize[1] * layerResolution;
    let [width, height] = [
      Math.ceil(this.tileSize[0] * layerResolution / resolution),
      Math.ceil(this.tileSize[1] * layerResolution / resolution)
    ];
    let [idxMax, idxMin] = [0, 0];
    const mapWidth = mapExtent[2] - mapExtent[0];
    for (let i = idxMin; i <= idxMax; i++) {
      let pixel = map.getPixelFromCoordinate([x + i * mapWidth, y]);
      let [pixelX, pixelY] = [pixel[0], pixel[1]];
      try {
        context.drawImage(tile.getImage(), Math.round(pixelX), Math.round(pixelY), width, height);
      } catch (e) {
      }
    }
  }

  /**
   * get tile
   * @param tiles
   * @returns {Array}
   * @private
   */
  _getTiles (tiles) {
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];
      const existTiles = this.tiles.filter(_tile => _tile.id === tile['id']);
      if (tile['id'] && existTiles.length > 0 && existTiles[0].url === existTiles[0].getErrorTile()) {
        existTiles[0].setOptions({
          x: tile.x,
          y: tile.y,
          z: tile.z,
          id: tile.id,
          url: tile.url
        });
      } else {
        this.tiles.push(new Tile(tile.url, tile.x, tile.y, tile.z, tile.id, this));
      }
    }
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
      let indexX = Math.pow((a[0] - centerTile[0]), 2) + Math.pow((a[1] - centerTile[1]), 2);
      let indexY = Math.pow((b[0] - centerTile[0]), 2) + Math.pow((b[1] - centerTile[1]), 2);
      return Math.abs(indexX - indexY);
    });
  }

  /**
   * get tiles
   * @returns {Array}
   * @private
   */
  _getTilesInternal () {
    const map = this.getMap();
    const size = map.getSize();
    const center = map.getCenter();
    const mapResolution = map.getResolution();
    const resolutions = map.getResolutions();
    const zoom = map._getNearestZoom(false);
    const layerResolution = resolutions[zoom];
    const scale = layerResolution / mapResolution;
    const scaledTileSize = [this.tileSize[0] * scale, this.tileSize[1] * scale];
    const width = Math.abs(size[0] * Math.cos(0)) + Math.abs(size[1] * Math.sin(0));
    const height = Math.abs(size[0] * Math.sin(0)) + Math.abs(size[1] * Math.cos(0));
    const centerTile = this._getTileIndex(center[0], center[1], zoom);
    let tileLeft = centerTile[0] - Math.ceil(width / scaledTileSize[0] / 2);
    let tileRight = centerTile[0] + Math.ceil(width / scaledTileSize[0] / 2);
    let tileBottom = centerTile[1] - Math.ceil(height / scaledTileSize[1] / 2);
    let tileTop = centerTile[1] + Math.ceil(height / scaledTileSize[1] / 2);
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
    const map = this.getMap();
    const resolutions = map.getResolutions();
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
    const map = this.getMap();
    const resolutions = map.getResolutions();
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
   * get coordinates from pixel
   * @param pixel
   * @returns {*[]}
   */
  getCoordinateFromPixel (pixel) {
    const size = this.getSize();
    const center = this.getCenter();
    const _resolution = this.getResolution();
    const halfSize = [size[0] / 2, size[1] / 2];
    return [
      (pixel[0] - halfSize[0]) * _resolution + center[0],
      (halfSize[1] - pixel[1]) * _resolution + center[1]
    ];
  }

  /**
   * get pixel from coordinates
   * @param coordinates
   * @returns {*[]}
   */
  getPixelFromCoordinate (coordinates) {
    const size = this.getSize();
    const halfSize = [size[0] / 2, size[1] / 2];
    const center = this.getCenter();
    const resolution = this.getResolution();
    return [
      halfSize[0] + (coordinates[0] - center[0]) / resolution,
      halfSize[1] - (coordinates[1] - center[1]) / resolution
    ];
  }
}

export default TileLayer

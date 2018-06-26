import { isNumber } from '../index';
import Projection from '../Proj/Projection';
import EPSG3857 from '../Proj/epsg3857';
class Base {
  extent: Array<number>;
  crossOrigin: any;
  origin: Array<number>;
  projection: Projection;
  constructor (options = {}) {
    /**
     * current layer opacity
     */
    options['opacity'] = isNumber(options['opacity']) ? options['opacity'] : 1;

    /**
     * is can cross origin
     * @type {boolean}
     */
    this.crossOrigin = !!options['crossOrigin'];

    /**
     * layer extent
     * @type {*|*[]}
     */
    this.extent = options['extent'] || this.projection.getExtent();

    /**
     * layer projection
     */
    this.projection = new EPSG3857(options['projection'] || 'EPSG:3857');

    /**
     * tile origin
     * @type {*}
     */
    this.origin = options['origin'] || [this.extent[0], this.extent[3]]; // left top
  }

  /**
   * return extent
   * @returns {*}
   */
  getExtent () {
    return this.extent;
  }

  /**
   * Set the extent at which the layer is visible.  If `undefined`, the layer
   * will be visible at all extents.
   * @param extent
   */
  setExtent (extent) {
    this.extent = extent;
    // this.load();
  }

  /**
   * load layer
   */
  load () {}
}

export default Base;

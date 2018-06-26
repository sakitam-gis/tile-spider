import { isNumber } from '../index';
class Base {
  extent: Array<number>;
  crossOrigin: any;
  projection: any;
  origin: Array<number>;
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
  };

  /**
   * Set the extent at which the layer is visible.  If `undefined`, the layer
   * will be visible at all extents.
   * @param extent
   */
  setExtent (extent) {
    this.extent = extent;
    // this.load();
  };

  /**
   * load layer
   */
  load () {}
}

export default Base

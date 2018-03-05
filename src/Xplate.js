/// reference
var XPlate = (function () {
    function XPlate() {
        this.items = [];
    }
    XPlate.prototype.getParent = function () {
        return this.parent;
    };
    XPlate.prototype.getEl = function () {
        if (!this._dom) {
            this._dom = this._processEl();
        }
        return this._dom;
    };
    XPlate.prototype._processEl = function () {
        return document.createElement('section');
    };
    /**
     *
     * @returns {any}
     */
    XPlate.prototype.render = function () {
        if (!this._dom) {
            var el = void 0, parentEl = void 0;
            el = this.processElement();
            if (!this.parent) {
                parentEl = this.renderTo;
            }
            else {
                this.parent.render();
                parentEl = this.parent.getDOM();
            }
            this._dom = el;
            parentEl.appendChild(el);
        }
        return this._dom;
    };
    /**
     *
     * @param parent
     * @param appliedInNew
     * @param appliedInOld
     * @returns {XPlate}
     */
    XPlate.prototype.setParent = function (parent, appliedInNew, appliedInOld) {
        if (parent === void 0) { parent = null; }
        if (appliedInNew === void 0) { appliedInNew = false; }
        if (appliedInOld === void 0) { appliedInOld = false; }
        var old = this.parent;
        if (old !== parent) {
            this.parent = parent;
            if (!appliedInOld && old) {
                old.remove(this, true);
            }
            if (!appliedInNew && parent) {
                parent.add(this);
            }
        }
        return this;
    };
    /**
     *
     * @param item
     * @param appliedIn
     */
    XPlate.prototype.remove = function (item, appliedIn) {
        if (appliedIn === void 0) { appliedIn = false; }
        var index = this.items.indexOf(item);
        if (index >= 0) {
            this.items.splice(index, 1);
        }
        if (!appliedIn) {
            item.setParent(null, true);
        }
        return this;
    };
    /**
     *
     * @param item
     * @param appliedIn
     * @returns {XPlate}
     */
    XPlate.prototype.append = function (item, appliedIn) {
        if (appliedIn === void 0) { appliedIn = false; }
        this.splice(null, null, item, false, appliedIn);
        return this;
    };
    /**
     *
     * @param item
     * @param appliedIn
     * @returns {XPlate}
     */
    XPlate.prototype.prepend = function (item, appliedIn) {
        if (appliedIn === void 0) { appliedIn = false; }
        this.splice(0, null, item, false, appliedIn);
        return this;
    };
    /**
     *
     * @param start
     * @param len
     * @param items
     * @param appliedInOld
     * @param appliedInNew
     */
    XPlate.prototype.splice = function (start, len, items, appliedInOld, appliedInNew) {
        if (start === void 0) { start = null; }
        if (len === void 0) { len = null; }
        if (items === void 0) { items = null; }
        if (appliedInOld === void 0) { appliedInOld = false; }
        if (appliedInNew === void 0) { appliedInNew = false; }
        var removedItems = this.items.splice(start ? start : this.items.length, len ? len : 0, items ? items : []);
        if (!appliedInOld) {
            for (var i = 0; i < removedItems.length; i++) {
                removedItems[i].setParent(null, true, true);
                this._onItemRemove(removedItems[i]);
            }
        }
        if (!appliedInNew) {
            for (var i = 0; i < items.length; i++) {
                items[i].setParent(this, true, false);
                this._onItemAdd(items[i]);
            }
        }
        return removedItems;
    };
    XPlate.prototype._onItemRemove = function (removedItem) {
    };
    XPlate.prototype._onItemAdd = function (item) {
    };
    return XPlate;
}());
//# sourceMappingURL=Xplate.js.map
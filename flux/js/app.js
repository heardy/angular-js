var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EventEmitter = (function () {
    function EventEmitter() {
        this.listeners = [];
    }
    EventEmitter.prototype.emit = function (event) {
        this.listeners.forEach(function (listener) {
            listener(event);
        });
    };

    EventEmitter.prototype.addListener = function (listener) {
        this.listeners.push(listener);
        return this.listeners.length - 1;
    };
    return EventEmitter;
})();

var m = angular.module('cart', []);

//-------------ACTIONS-------------

var ADD_ITEM = "ADD_ITEM";
var REMOVE_ITEM = "REMOVE_ITEM";

m.factory("cartActions", function(dispatcher) {
    return {
        addItem: function (item) {
            dispatcher.emit({
                actionType: ADD_ITEM,
                item: item
            });
        },
        removeItem: function (item) {
            dispatcher.emit({
                actionType: REMOVE_ITEM,
                item: item
            });
        }
    };
});



//-------------DISPATCHER-------------
m.service("dispatcher", EventEmitter);



//-------------STORE-------------

var CartStore = (function (_super) {
    __extends(CartStore, _super);
    function CartStore() {
        _super.call(this);
        this.cartItems = [];
    }
    CartStore.prototype.addItem = function (catalogItem) {
        var items = this.cartItems.filter(function (i) {
            return i.catalogItem == catalogItem;
        });
        if (items.length == 0) {
            this.cartItems.push({ qty: 1, catalogItem: catalogItem });
        } else {
            items[0].qty += 1;
        }
    };

    CartStore.prototype.removeItem = function (cartItem) {
        var index = this.cartItems.indexOf(cartItem);
        this.cartItems.splice(index, 1);
    };

    CartStore.prototype.emitChange = function () {
        this.emit("change");
    };
    return CartStore;
})(EventEmitter);

m.factory("cartStore", function(dispatcher) {
    var cartStore = new CartStore();

    dispatcher.addListener(function (action) {
        switch (action.actionType) {
            case ADD_ITEM:
                cartStore.addItem(action.item);
                break;

            case REMOVE_ITEM:
                cartStore.removeItem(action.item);
                break;
        }
        cartStore.emitChange();
    });

    return {
        addListener: function (l) {
            return cartStore.addListener(l);
        },
        cartItems: function () {
            return cartStore.cartItems;
        }
    };
});

m.value("catalogItems", [
  {id: 1, title: 'Widget #1', cost: 1},
  {id: 2, title: 'Widget #2', cost: 2},
  {id: 3, title: 'Widget #3', cost: 3}
]);



//-------------VIEW-------------

var CatalogCtrl = (function () {
    function CatalogCtrl(catalogItems, cartActions) {
        this.cartActions = cartActions;
        this.catalogItems = catalogItems;
    }
    CatalogCtrl.prototype.addToCart = function (catalogItem) {
        this.cartActions.addItem(catalogItem);
    };
    return CatalogCtrl;
})();
m.controller("CatalogCtrl", CatalogCtrl);


var CartCtrl = (function () {
    function CartCtrl(cartStore, cartActions) {
        var _this = this;
        this.cartStore = cartStore;
        this.cartActions = cartActions;
        this.resetItems();

        cartStore.addListener(function () {
            return _this.resetItems();
        });
    }
    CartCtrl.prototype.resetItems = function () {
        this.items = this.cartStore.cartItems();
    };

    CartCtrl.prototype.removeItem = function (item) {
        this.cartActions.removeItem(item);
    };
    return CartCtrl;
})();
m.controller("CartCtrl", CartCtrl);

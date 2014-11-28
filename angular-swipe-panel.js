(function(w) {
    "use strict";

    w.angular.module('angular-swipe-panel', [])
            /**
             * 
             * @description This Factory, contains all created Panels for later reuse
             * @returns {_L7.Anonym$1}
             */
            .factory('nano_allPanels', function() {
                return {};
            })
            /**
             * 
             * @description Contains changeable Configuration values for the panels
             * @returns {_L1._L17.Anonym$3}
             */
            .factory('swipePanelConfigs', [
                function() {
                    return {
                        //Amount of touch Events stored, until the Panel shoud do Something
                        XRegisterDistance: 25,
                        //Percantage distance of the swipe, relative to the window width, starting to stop the listening
                        YIgnoreDistance: 8,
                        //Percentage width of the panel relative to the screen width.
                        panelWidth: 80,
                        //Percentage distance of the half opened panel, until it shoud bounce to open/close
                        toggleDistance: 75
                    };
                }
            ])
            /**
             * 
             * @description Contains neccesarry Constants for the Swipe-Panels
             */
            .constant('nano_swipePanelConst', new function() {
                this.W3CTouch = ("ontouchstart" in w) && ("ontouchmove" in w) && ("ontouchend" in w) && ("ontouchcancel" in w);
                this.isMSTouch = ("onmspointerdown" in w) && ("onmspointermove" in w) && ("onmspointerup" in w) && ("onmspointerover" in w) && ("onmspointerout" in w);
                this.touchStart = this.W3CTouch ? "touchstart" : this.isMSTouch ? "MSPointerDown" : "mousedown";
                this.touchEnd = this.W3CTouch ? "touchend" : this.isMSTouch ? "MSPointerUp" : "mouseup";
                this.touchMove = this.W3CTouch ? "touchmove" : this.isMSTouch ? "MSPointerMove" : "mousemove";
            })
            /**
             * 
             * @param {_L1._L17.Anonym$3} conf The Configurations for the panels
             * @param {Object} cons The Constants for the Panels
             * @param {_L7.Anonym$1} panels The Saved Panels
             */
            .run([
                'swipePanelConfigs',
                'nano_swipePanelConst',
                'nano_allPanels',
                'panelActions',
                function(conf, cons, panels, actions) {
                    /**
                     * 
                     * @description Stores the Data, collected in one swipe
                     * @type Object
                     */
                    var dataContainer = {
                        touchesX: [],
                        touchesY: [],
                        coordsX: {min: 0, max: 0},
                        coordsY: {min: 0, max: 0},
                        direction: '',
                        diff: 0,
                        oppositeDirection: ''
                    };

                    /**
                     * 
                     * @description Looks in which direction the user swiped
                     */
                    function directionChecker() {
                        dataContainer.coordsX.min = Math.min.apply(null, dataContainer.touchesX);
                        dataContainer.coordsX.max = Math.max.apply(null, dataContainer.touchesX);
                        dataContainer.coordsY.min = Math.min.apply(null, dataContainer.touchesY);
                        dataContainer.coordsY.max = Math.max.apply(null, dataContainer.touchesY);

                        var xDiff = dataContainer.coordsX.max - dataContainer.coordsX.min;
                        var yDiff = dataContainer.coordsY.max - dataContainer.coordsY.min;

                        if (yDiff >= (w.innerHeight / 100 * conf.YIgnoreDistance) || yDiff > xDiff || dataContainer.touchesX.length < 5 && xDiff < w.innerWidth / 100 * conf.XRegisterDistance) {
                            return;
                        }

                        var xBecomingLarger = dataContainer.touchesX[0] < dataContainer.touchesX[dataContainer.touchesX.length - 1];
                        dataContainer.direction = xBecomingLarger ? 'right' : 'left';
                        dataContainer.oppositeDirection = xBecomingLarger ? 'left' : 'right';
                    }
                    /**
                     * @description Checks if the Panel is already total open
                     * @returns {Boolean}
                     */
                    function isOpenMax() {
                        var rightPanel = dataContainer.direction === 'left' && (panels[dataContainer.oppositeDirection].newX + panels[dataContainer.oppositeDirection].parentMargin - (w.innerWidth / 100 * (100 - conf.panelWidth)) <= 0);
                        var leftPanel = dataContainer.direction === 'right' && panels[dataContainer.oppositeDirection].newX + panels[dataContainer.oppositeDirection].parentMargin >= 0;
                        if (leftPanel || rightPanel) {
                            return true;
                        }
                        return false;
                    }

                    /**
                     * 
                     * @description Contains Event-Listeners for different Events
                     * @type Object
                     */
                    var swipe = {
                        /**
                         * 
                         * @description Registers the first Coordinates and adds a touchMove Listener
                         * @param {Object} evt The ClickStart Event
                         */
                        touchStart: function(evt) {
                            var xClick = cons.W3CTouch ? evt.touches[0].screenX : cons.isMSTouch ? evt.clientX : evt.clientX;
                            dataContainer.touchesX.push(xClick);
                            dataContainer.touchesY.push(w.scrollY);
                            w.addEventListener(cons.touchMove, swipe.touchMove, false);
                        },
                        /**
                         * 
                         * @description Unregisters the touchMove Event and checks if the panel shoud bounce-open
                         * @param {Object} evt The ClickEnd Event
                         */
                        touchEnd: function(evt) {
                            w.removeEventListener(cons.touchMove, swipe.touchMove);
                            var xClick = cons.W3CTouch ? evt.changedTouches[0].screenX : cons.isMSTouch ? evt.clientX : evt.clientX;
                            dataContainer.touchesX.push(xClick);
                            dataContainer.touchesY.push(w.scrollY);

                            if (dataContainer.direction === '') {//If swipe Method doesnt worked
                                directionChecker();
                            }

                            if (dataContainer.direction !== '') {//If the user Swiped
                                if (!panels[dataContainer.direction].isOpen) {//If the opposide Panel is closed
                                    var diff = dataContainer.coordsX.max - dataContainer.coordsX.min;
                                    var open_close = diff >= conf.toggleDistance ? 'open' : 'close';
                                    panels[dataContainer.oppositeDirection][open_close]();
                                } else {
                                    panels[dataContainer.direction].close();
                                }
                            }

                            dataContainer.touchesX.length = 0;
                            dataContainer.coordsX.min = 0;
                            dataContainer.coordsX.max = 0;
                            dataContainer.touchesY.length = 0;
                            dataContainer.coordsY.min = 0;
                            dataContainer.coordsY.max = 0;
                            dataContainer.direction = '';
                            dataContainer.oppositeDirection = '';
                        },
                        /**
                         * 
                         * @description Saves all coordiantes the user travels
                         * @param {Object} evt The touchMove Event
                         */
                        touchMove: function(evt) {
                            var xTouch = cons.W3CTouch ? evt.touches[0].screenX : cons.isMSTouch ? evt.clientX : evt.clientX;
                            //
                            if (dataContainer.touchesX.length < (conf.XRegisterDistance * 2)) {
                                dataContainer.touchesX.push(xTouch);
                                dataContainer.touchesY.push(w.scrollY);
                            }

                            if (dataContainer.touchesX.length < conf.XRegisterDistance) {//If we dont have enought data
                                return;
                            } else if (dataContainer.touchesX.length === conf.XRegisterDistance) {
                                directionChecker();
                            }
                            if (dataContainer.direction === '' || panels[dataContainer.direction].isOpen) {
                                return;
                            }
                            var oldx = panels[dataContainer.oppositeDirection].newX || 0;
                            if (dataContainer.oppositeDirection === 'left') {//von links
                                panels[dataContainer.oppositeDirection].newX = (xTouch - (w.innerWidth / 100 * conf.panelWidth)) - panels[dataContainer.oppositeDirection].parentMargin;
                            } else {//von rechts
                                panels[dataContainer.oppositeDirection].newX = xTouch - panels[dataContainer.oppositeDirection].parentMargin;
                            }
                            if (isOpenMax()) {
                                return;
                            }
                            evt.preventDefault();//Stop pagescrolling
                            //
                            var ce = {'transition-duration': '0s'};
                            ce[panels[dataContainer.oppositeDirection].cssProps.transform] = 'translate3d(' + panels[dataContainer.oppositeDirection].newX + 'px, 0px,0px)';
                            panels[dataContainer.oppositeDirection].element.css(ce);
                        }
                    };
                    w.addEventListener(cons.touchStart, swipe.touchStart, false);
                    w.addEventListener(cons.touchEnd, swipe.touchEnd, false);
                    w.addEventListener('resize', actions.resize, false);
                }
            ])
            /**
             * 
             * @description You can access Panel actions with this Factory
             * @param {_L7.Anonym$1} panels All created Panels as Object
             * @returns {_L17.Anonym$3}
             */
            .factory('panelActions', [
                'nano_allPanels',
                function(panels) {
                    /**
                     * 
                     * @description Checks if the Panel exists
                     * @param {String} name The position of the Panel
                     * @returns {Boolean}
                     */
                    function panelExists(name) {
                        return typeof name === 'string' && typeof panels[name] !== 'undefined';
                    }
                    return {
                        resize: function() {
                            for (var i in panels) {
                                panels[i].resize();
                            }
                        },
                        /**
                         * 
                         * @description This Method opens or closed a specific Panel. If the Param is undefined it closed all open Panels.
                         * @param {String|Undefined} panelName The Name (Or Position like "left" or "right") of the toggeling panel
                         * @returns {Boolean} False if nothing happend
                         */
                        toggle: function(panelName) {
                            if (typeof panelName === 'string' && typeof panels[panelName] !== 'undefined') {
                                return panels[panelName].toggle();
                            } else {
                                for (var index in panels) {
                                    if (panels[index].isOpen) {
                                        return panels[index].toggle();
                                    }
                                }
                            }
                            return false;
                        },
                        /**
                         * 
                         * @description Opens a specific Panel
                         * @param {String} name The Name of the Panel
                         * @returns {Boolean}
                         */
                        open: function(name) {
                            if (!panelExists(name) && !panels[name].isOpen) {
                                return false;
                            }
                            return panels[name].open();

                        },
                        /**
                         * 
                         * @description Closes a specific Panel
                         * @param {String} name The Name of the Panel
                         * @returns {Boolean}
                         */
                        close: function(name) {
                            if (!panelExists(name) && panels[name].isOpen) {
                                return false;
                            }
                            return panels[name].close();

                        }
                    };
                }
            ])
            /**
             * 
             * @description Creates a new Panel, with all neccesarry Methods and Propertys
             * @param {_L1._L17.Anonym$3} configs The Panel Configurations
             * @returns {Object}
             */
            .factory('nano_panelCreator', [
                'swipePanelConfigs',
                function(configs) {
                    return function(element, position) {
                        this.position = position;
                        this.element = element;
                        this.isOpen = false;
                        this.parentMargin = (w.innerWidth - this.element.parent()[0].offsetWidth) / 2;

                        this.resize = function() {
                            this.width = (w.innerWidth / 100 * configs.panelWidth);
                            this.startX = (this.position === 'left' ? 0 - this.width : w.innerWidth) - this.parentMargin;
                            this.stopX = (this.position === 'left' ? 0 : (w.innerWidth / 100 * (100 - configs.panelWidth))) - this.parentMargin;
                            var ncss = {
                                'width': this.width + 'px',
                                'transition-duration': '0s'
                            };
                            this.element.css(ncss);
                        };
                        this.resize();
                        var s = w.document.body.style;
                        // detect css features
                        this.cssProps = ("MozTransition" in s && "MozTransform" in s) ? {
                            domTransition: "MozTransition",
                            transition: "-moz-transition",
                            transform: "-moz-transform",
                            domTransform: "MozTransform",
                            radialGradient: "-moz-radial-gradient",
                            repeatingLinearGradient: "-moz-repeating-linear-gradient",
                            translate3d: "translate3d",
                            userSelect: "-moz-user-select"
                        } : ("WebkitTransition" in s && "WebkitTransform" in s) ? {
                            domTransition: "WebkitTransition",
                            transition: "-webkit-transition",
                            transform: "-webkit-transform",
                            domTransform: "WebkitTransform",
                            radialGradient: "-webkit-radial-gradient",
                            repeatingLinearGradient: "-webkit-repeating-linear-gradient",
                            translate3d: "translate3d",
                            userSelect: "-webkit-user-select"
                        } : ("msTransition" in s && "msTransform" in s) ? {
                            domTransition: "msTransition",
                            transition: "-ms-transition",
                            transform: "-ms-transform",
                            domTransform: "msTransform",
                            radialGradient: "-ms-radial-gradient",
                            repeatingLinearGradient: "-ms-repeating-linear-gradient",
                            translate3d: "translate3d",
                            userSelect: "-ms-user-select"
                        } : {
                            domTransition: "transition",
                            transition: "transition",
                            transform: "transform",
                            domTransform: "transform",
                            radialGradient: "radial-gradient",
                            repeatingLinearGradient: "repeating-linear-gradient",
                            translate3d: "translate3d",
                            userSelect: "user-select"
                        };

                        this.toggle = function() {
                            this[(this.isOpen ? 'close' : 'open')]();
                        };
                        this.open = function() {
                            this.isOpen = true;
                            var ce = {'transition-duration': '0.3s'};
                            ce[this.cssProps.transform] = 'translate3d(' + this.stopX + 'px, 0px,0px)';
                            this.element.css(ce);
                        };
                        this.close = function() {
                            this.isOpen = false;
                            var ce = {'transition-duration': '0.3s'};
                            ce[this.cssProps.transform] = 'translate3d(' + this.startX + 'px, 0px,0px)';
                            this.element.css(ce);
                        };
                        this.element.parent().css({'width': w.innerWidth + 'px'});
                        var css = {
                            'position': 'fixed',
                            'top': '0px',
                            'z-index': '9999',
                            'width': this.width + 'px',
                            'height': '150%',
                            'transition-timing-function': 'ease-in-out'
                        };
                        css[this.cssProps.transform] = 'translate3d(' + this.startX + 'px, 0px,0px)';
                        this.element.css(css);
                    };
                }
            ])
            /**
             * 
             * @description The directive, which creates a new Panel an saves this Panel in L7.Anonym$1
             * @param {_L7.Anonym$1} panels All created Panels as Object
             * @param {Function} Creator Can create a new Panel Object
             * @returns {_L33.Anonym$5}
             */
            .directive('ngSwipePanel', [
                'nano_panelCreator',
                'nano_allPanels',
                function(Creator, panels) {
                    return {
                        compile: function(element, attr) {
                            var position = attr['ngSwipePanel'];
                            if (typeof panels[position] !== 'undefined') {
                                return;
                            }
                            panels[position] = new Creator(element, position);
                        }
                    };
                }
            ]);
})(window);
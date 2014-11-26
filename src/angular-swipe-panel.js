"use strict";

angular.module('angular-swipe-panel', [])
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
         * @description You can access Panel actions with this Factory
         * @param {_L7.Anonym$1} panels All created Panels as Object
         * @returns {_L17.Anonym$3}
         */
        .factory('panelActions', [
            'nano_allPanels',
            function(panels) {
                return {
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
                    }
                };
            }
        ])
        /**
         * 
         * @description This Constructor, can create a new Panel Object with all the neccesary Methods and Params
         * @returns {Function}
         */
        .factory('nano_panelCreator', function() {
            return function(panel_element, panel_position) {
                this.postion = panel_position;
                this.element = panel_element;
                this.isOpen = false;
            };
        })
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
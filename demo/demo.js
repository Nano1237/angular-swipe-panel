angular.module('myApp', [
    'angular-swipe-panel'
]).run([
    'swipePanelConfigs',
    function(swipePanelConfigs) {
//        swipePanelConfigs.ptc = 34;
    }
]).controller('MainCtrl', [
    '$scope',
    'panelActions',
    function($scope, panelActions) {
//        panelActions.toggle('left');
//        console.log(panelActions);
    }
]);
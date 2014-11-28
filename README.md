# angular-swipe-panel

A AngularJS module, with a directive to create wipeable panels.
The created panels, almost look like the one you find in a native programmed Smartphone App

## DEMO

[Demo fiddle](http://jsfiddle.net/gh/get/AngularJS/1.2.1/Nano1237/angular-swipe-panel/tree/master/demo), with working example

## Quick use

1. Clone the repository 
```
$ git clone https://github.com/Nano1237/angular-swipe-panel.git
```
2. Include the Javascript file
```
<script src="{path-to-js-files}/angular-swipe-panel.js"></script>
```
3. Add the Module in your AngularJS app `"angular-swipe-panel"`
4. Create one or two Elements with the panel directive `ng-swipe-panel="{postion}"`
5. Style it any way you like

## Advanced use

#### How to add the Module to my App?

```
...
angular.module('myApp', [
    ...
    'angular-swipe-panel' //Add the new Module Name here!
    ...
]);
...
```

#### How does the Element with the directive looks like?

```
...
<body>
    <!-- Thats how you add it -->
    <div ng-swipe-panel="left">Left Panel Content</div>
    <div ng-swipe-panel="right">Right Panel Content</div>
    <div>Page Content</div>
</body>
...
```

### How can I configure the Module?

You can configure some Options in th run block of your angularjs app like this

```
angular.module('myApp', [
    'angular-swipe-panel'
]).run([
    'swipePanelConfigs',//The Configuration Service
    function(swipePanelConfigs) {
        //Amount of touch Events stored, until the Panel shoud do Something
        swipePanelConfigs.XRegisterDistance = 25;
        //Percantage distance of the swipe, relative to the window width, starting to stop the listening
        swipePanelConfigs.YIgnoreDistance = 8;
        //Percentage width of the panel relative to the screen width.
        swipePanelConfigs.panelWidth = 80;
        //Percentage distance of the half opened panel, until it shoud bounce to open/close
        swipePanelConfigs.toggleDistance = 75;
    }
])
```

### How can I open/close a Panel manualy?

You can manipulate the Panel Manualy with the panelActions Sevice. 

1. Open a Panel with the `panelActions.open(panelPosition)` Method
2. Close a Panel with the `panelActions.close(panelPosition)` Method
3. Trigger a Panel Resizing with the `panelActions.resize()` Method
4. Toggle open/close Panels with the `panelActions.toggle(panelPosition)` Method


This Service is also available from the $rootScope.

Example:
```
angular.module('myApp', [
    'angular-swipe-panel'
]).controller('MainCtrl', [
    'panelActions',
    function(panelActions) {
        panelActions.open('left');//opens the left panel if it is closed (and exists)
    }
]);
```

### How can I listen for actions triggert by the Panel?

The panelActions Service also provides a `panelActions.on(panelPosition,trigger,callback)` and `panelActions.off(panelPosition)` Method.

```
angular.module('myApp', [
    'angular-swipe-panel'
]).controller('MainCtrl', [
    'panelActions',
    function(panelActions) {
        var callback = function(panel){[...]}
        var listener = panelActions.on('left','beforeOpen', callback);//triggers everytime before opening
        panelActions.on('left','afterOpen', callback);//triggers after everything is done

        panelActions.off(listener);//Remove the beforeOpen listener from the left panel
        panelActions.off('left'); //Removes all listeners from the left panel
    }
]);
```
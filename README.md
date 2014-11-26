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
4. Create a Element with the panel directive `ng-swipe-panel="{postion}"`
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
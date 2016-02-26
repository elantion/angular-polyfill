# angular-polyfill
Just put it before angular.js, then everything work.

```html
<!--[if lt IE 9]>
  <script type="text/javascript" src="/js/custom/angular-polyfill.min.js"></script>
<![endif]-->
<script type="text/javascript" src="/js/angularjs/angular.min.js"></script>
```
Do not put it after es5-sham.js, otherwisw you will lost the magic.

###suport version
Only support angular.js v1.4.7

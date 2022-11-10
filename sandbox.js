(function() {
  var src = 'https://www.nrk.no/serum/latest/js/sandbox';
  if(typeof require === 'function' && typeof define == 'function' && define.amd) {
    var r = require.config({paths:{'Serum.Sandbox' : src }});
    r(['Serum.Sandbox']);
  } else {
    var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = src + '.js';
    var el = document.getElementsByTagName('script')[0]; el.parentNode.insertBefore(s, el);
  }
});

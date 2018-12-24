import PymParticle from "./particle";

var $ = require("./lib/qsa");

$("[data-pym]").forEach(function(element) {
  var host = PymParticle.shim(element);
})
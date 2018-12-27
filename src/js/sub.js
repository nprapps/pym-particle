import PymParticle from "./particle/index";

var guest = PymParticle.registerGuest();
guest.sendHeight();

setInterval(() => {
  document.body.style.height = Math.random() * 100 + 100 + "px";
}, 1000);
import { encodeLegacy } from "./encoding";

export default class GuestParticle {
  constructor() {
    var here = new URL(window.location);
    this.id = here.searchParams.get("childId");

    this.listeners = {};

    window.addEventListener("resize", () => this.sendHeight());
    window.addEventListener("message", e => this.onMessage(e));

    this.sendHeight();
  }

  send(message) {
    window.parent.postMessage(message, "*");
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  onMessage(e) {
    var decoded = typeof e.data == "string" ? decode(e.data) : e.data;
    if (decoded.type in this.listeners) {
      this.listeners.forEach(cb => cb(decoded.value));
    }
  }

  sendHeight() {
    var height = document.documentElement.offsetHeight;
    var pymFormatted = encodeLegacy(this.id, "height", height);
    // for convenience, we just use the same format as AMP
    var ampFormatted = {
      sentinel: "amp",
      type: "embed-size",
      height
    };
    this.send(pymFormatted);
    this.send(ampFormatted);
  }
}
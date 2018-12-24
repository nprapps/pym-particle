import { encode, decode } from "./encoding";
import GuestParticle from "./guest";

class PymParticle extends HTMLElement {
  constructor(element) {
    super();

    element = element || this;

    element.style.display = "block";

    var shadow = element.attachShadow({ mode: "open" });
    var iframe = this.iframe = document.createElement("iframe");
    shadow.appendChild(iframe);
    iframe.style.width = "100%";
    iframe.style.border = "none";
    iframe.setAttribute("seamless", "true");

    this.onMessage = this.onMessage.bind(this);
  }

  connectedCallback() {
    window.addEventListener("message", this.onMessage);
  }

  disconnectedCallback() {
    window.removeEventListener("message", this.onMessage);
  }

  static get observedAttributes() {
    return ["src", "id"];
  }

  attributeChangedCallback(attribute, was, value) {
    switch (attribute) {
      case "src":
        this.iframe.src = value;
        break;

      case "id":
        this.iframe.id = value;
    }
  }

  onMessage(e) {
    // ignore other iframes
    if (e.source != this.iframe.contentWindow) return;
    var decoded = typeof e.data == "string" ? decode(e.data) : e.data;
    if (decoded.type == "embed-size" || decoded.type == "height") {
      this.iframe.height = decoded.value || decoded.height;
    }
  }

  sendMessage(message) {
    this.iframe.contentWindow.postMessage(message, "*");
  }

  static asGuest(options) {
    return new GuestParticle(options);
  }

  static shim(element) {
    var host = new PymParticle(element);
    host.connectedCallback();
    host.watcher = new MutationObserver(function(list) {
      for (var mutation of list) {
        if (mutation.type == "attributes") {
          var was = mutation.oldValue;
          var is = mutation.target.getAttribute(mutation.attributeName);
          host.attributeChangedCallback(mutation.attributeName, was, is);
        }
      }
    });
    host.watcher.observe(element, {
      attributes: true
    });
    for (var attr of element.attributes) {
      host.attributeChangedCallback(attr.name, null, attr.value);
    }
    return host;
  }

}

if ("customElements" in window && customElements.define) {
  customElements.define("pym-particle", PymParticle);
}

export default PymParticle;
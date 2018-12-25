import { encode, decode } from "./encoding";
import GuestParticle from "./guest";

class PymParticle extends HTMLElement {
  constructor(element) {
    super();

    element = element || this;
    // used when calling as a non-custom element
    this.ref = element;
    var iframe = this.iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.border = "none";
    iframe.setAttribute("seamless", "true");

    this.onMessage = this.onMessage.bind(this);
  }

  connectedCallback() {
    if (!this.iframe.parentElement) {
      var element = this.ref;
      element.style.display = "block";
      var root = element.attachShadow ? element.attachShadow({ mode: "open" }) : element;
      root.appendChild(this.iframe);
    }
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

  static registerGuest(options) {
    return new GuestParticle(options);
  }

  // use this to upgrade elements in browsers that don't support Custom Elements
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
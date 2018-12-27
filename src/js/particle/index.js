import { encode, decode } from "./encoding";
import GuestParticle from "./guest";

class PymParticle extends HTMLElement {
  constructor() {
    super();

    var iframe = this.iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.border = "none";
    iframe.setAttribute("seamless", "true");

    this.onMessage = this.onMessage.bind(this);
  }

  connectedCallback() {
    if (!this.iframe.parentElement) {
      this.style.display = "block";
      var root = this.attachShadow ? this.attachShadow({ mode: "open" }) : this;
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

}

if ("customElements" in window && customElements.define) {
  customElements.define("pym-particle", PymParticle);
}

export default PymParticle;
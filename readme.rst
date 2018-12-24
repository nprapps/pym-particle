Pym Particle
============

Modern Pym for modern browsers.

**Important note: this repo is an experiment only! Do not use this on production pages!**

This project provides a responsive iframe solution that's compatible with Pym v1 for the basics, but with a simpler core built around newer JavaScript standards::

* Uses transferable JSON for messages, instead of an encoded key/value string
* Auto-initializes through the Custom Elements interface if available
* Uses shadow DOM to isolate the iframe from parent page styling
* Defers navigation to ``<a target="_parent">``
* Defers scrolling to ``Element.scrollIntoView()``

If you're using this in a browser that supports custom elements, you should be able to create a host frame by simply adding the correct element to your page::

    <pym-particle src="https://your-embed-here"></pym-particle>

In older browsers, you can use the shim method to initialize any element with a "data-pym" and "src" attributes::

    <div data-pym src="https://your-embed-here"></div>

    <script>
      // assuming you've loaded the script
      document.querySelectorAll(`[data-pym]`).forEach(el => PymParticle.shim(el));
    </script>

On the other side, embedded pages should call ``PymParticle.asGuest()`` to start sending height events to the parent. ``asGuest()`` returns a GuestParticle instance, which supports Pym v1 ``on()`` event listeners for legacy events. However, we recommend that guest pages using Pym Particle use ``window.parent.postMessage()`` to send messages instead, as it's simpler and supports more complex data formats.
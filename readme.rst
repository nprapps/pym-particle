Pym Particle
============

*Modern Pym for modern browsers*

**Important note: this repo is not production-ready, and should not be used on live pages!**

Pym Particle is a responsive iframe solution that's compatible with Pym v1 for basic height management, but with a simpler core built around newer JavaScript standards::

* Uses transferable JSON for messages, instead of a proprietary string
* Based on Custom Elements v1
* Uses shadow DOM to isolate the iframe from parent page styling
* Smaller API surface area

If you're using this in a browser that supports custom elements, you should be able to create a host frame by simply adding the correct element to your page::

    <pym-particle src="https://your-embed-here"></pym-particle>

In older browsers, you can use the shim method to initialize any element with a "data-pym" and "src" attributes::

    <div data-pym src="https://your-embed-here"></div>

    <script>
      // assuming you've loaded the script
      document.querySelectorAll(`[data-pym]`).forEach(el => PymParticle.shim(el));
    </script>

On the other side, embedded pages should call ``PymParticle.registerGuest()`` to start sending height events to the parent. ``registerGuest()`` returns a GuestParticle instance, which supports Pym v1 ``on()`` event listeners for legacy events. However, we recommend that guest pages using Pym Particle use ``window.parent.postMessage()`` to send messages instead, as it's simpler and supports more complex data formats.

Frequently Asked Questions
--------------------------

Is this a replacement for the existing Pym?
  **No, not at this time.** This project is a thought experiment on what Pym would look like if we wrote it today, keeping the core small and leveraging the features built-in to modern browsers. It is also a way to open a conversation with community members about what they want and need from an updated version of Pym.

How do I scroll to an element in Pym Particle?
  Instead of offering a ``scrollParentToChildPos()``, requiring you to compute the offset of the element, use the browser's native ``Element.scrollIntoView()`` method (`documentation on MDN <https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView>`_).

How do I navigate the parent page?
  If possible, for accessibility reasons, page navigations should be exposed as links. Use the ``target="_parent"`` attribute to ask the parent page to navigate. If you need to navigate programmatically, you may need to write a custom message handler for it--Pym Particle does not make assumptions about how your single-page app handles routing.

Does Pym Particle provide arbitrary messaging support?
  No. Sending messages using ``window.postMessage()`` between guest and host pages is simple enough that it does not make sense to provide additional layers of abstraction. We will, however, make available a loader library that demonstrates some useful functionality, such as firing visibility events and passing data between frames.
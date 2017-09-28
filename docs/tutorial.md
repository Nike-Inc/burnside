## Tutorial Developer Guide

Burnside's CLI includes a test-drive workshop (TDW) developed around a series of Burnside tests running within an outer test, all powered by [Reveal.js](https://github.com/hakimel/reveal.js/).

The pattern for an exercise slide is as follows:

```
<section>
  <p>
    <span class="orange">Burnside</span> follows a fluent chaining syntax that allows you to string together multiple commands into a single test.
  </p>
<pre><code id="ba" contenteditable style="background:black;">
const selector = '#exampleButton';

burnside
.exec([selector], (sel, cl) => {
  document.querySelector(sel).classList.add('bar');
})
.exists(selector + '.foo');

// expectedOutput === '{}'

/* Relevant HTML
<button id="exampleButton" class="example" data-value='foo'></button>
*/
</code></pre>

<button class="btn run" data-editor="ba" data-output='{}' data-outputId="oa">Run</button>

Results:&nbsp;<span style="max-width:200px;" id="oa"></span>

<p>Expected output: <code style="background:black">{}</code></p>
<p>
  <a target='_blank' href="http://localhost:9876/base/resources/index.html">View the Test HTML</a>
</p>
</section>

```

In order to modify the template to add a new slide you simply need to assign each HTML element a new (unique) `id` and then update the `data-editor`, `data-output`, and `data-outputId` of the `<button class="run">` that you are using to run the code.

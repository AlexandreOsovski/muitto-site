/* ==========================================================================
   Playground — a browser-safe port of src/assert.ts's matcher engine.
   deepEqual/stringify/matcher bodies mirror the real implementation; only
   the Node-only bits (disk snapshots) are left out, since they don't apply
   in a browser tab. Engine logic is unchanged from the original — only the
   rendering/wiring code below it uses the new BEM class names.
   ========================================================================== */
(function(){
  "use strict";

  function deepEqual(a, b){
    if (Object.is(a, b)) return true;
    if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
    if (a instanceof RegExp && b instanceof RegExp) return a.toString() === b.toString();
    if (Array.isArray(a) || Array.isArray(b)) {
      if (!Array.isArray(a) || !Array.isArray(b)) return false;
      if (a.length !== b.length) return false;
      return a.every(function(item, i){ return deepEqual(item, b[i]); });
    }
    if (a instanceof Map && b instanceof Map) {
      if (a.size !== b.size) return false;
      for (var entry of a) { if (!b.has(entry[0]) || !deepEqual(entry[1], b.get(entry[0]))) return false; }
      return true;
    }
    if (a instanceof Set && b instanceof Set) {
      if (a.size !== b.size) return false;
      for (var v of a) { if (!Array.from(b).some(function(bv){ return deepEqual(v, bv); })) return false; }
      return true;
    }
    if (typeof a === "object" && a !== null && typeof b === "object" && b !== null) {
      var ak = Object.keys(a), bk = Object.keys(b);
      if (ak.length !== bk.length) return false;
      return ak.every(function(k){ return deepEqual(a[k], b[k]); });
    }
    return false;
  }

  function stringify(value){
    if (typeof value === "string") return '"' + value + '"';
    if (typeof value === "function") return value.toString();
    if (value === undefined) return "undefined";
    if (value === null) return "null";
    if (typeof value === "number" && Number.isNaN(value)) return "NaN";
    try { var s = JSON.stringify(value, null, 2); return s === undefined ? String(value) : s; }
    catch (e) { return String(value); }
  }

  function AssertionError(message, expected, received){
    var err = new Error(message);
    err.name = "AssertionError";
    err.expected = expected;
    err.received = received;
    return err;
  }

  function makeMatchers(actual, isNot){
    function must(condition, msgFail, msgNot, expected){
      var pass = isNot ? !condition : condition;
      if (!pass) throw AssertionError(isNot ? msgNot : msgFail, expected, actual);
    }
    var matchers = {
      toBe: function(expected){
        must(Object.is(actual, expected),
          "expected " + stringify(actual) + " to be (===) " + stringify(expected),
          "expected " + stringify(actual) + " NOT to be (===) " + stringify(expected), expected);
      },
      toEqual: function(expected){
        must(deepEqual(actual, expected),
          "expected " + stringify(actual) + " to equal " + stringify(expected),
          "expected " + stringify(actual) + " NOT to equal " + stringify(expected), expected);
      },
      toBeTruthy: function(){ must(!!actual, "expected " + stringify(actual) + " to be truthy", "expected " + stringify(actual) + " NOT to be truthy"); },
      toBeFalsy: function(){ must(!actual, "expected " + stringify(actual) + " to be falsy", "expected " + stringify(actual) + " NOT to be falsy"); },
      toBeNull: function(){ must(actual === null, "expected " + stringify(actual) + " to be null", "expected " + stringify(actual) + " NOT to be null"); },
      toBeUndefined: function(){ must(actual === undefined, "expected " + stringify(actual) + " to be undefined", "expected " + stringify(actual) + " NOT to be undefined"); },
      toBeDefined: function(){ must(actual !== undefined, "expected value to be defined", "expected value NOT to be defined"); },
      toBeNaN: function(){ must(typeof actual === "number" && Number.isNaN(actual), "expected " + stringify(actual) + " to be NaN", "expected " + stringify(actual) + " NOT to be NaN"); },
      toContain: function(item){
        var contains = false;
        if (typeof actual === "string") contains = actual.includes(String(item));
        else if (Array.isArray(actual)) contains = actual.some(function(el){ return deepEqual(el, item); });
        must(contains, "expected " + stringify(actual) + " to contain " + stringify(item), "expected " + stringify(actual) + " NOT to contain " + stringify(item), item);
      },
      toHaveLength: function(len){
        var l = actual && actual.length;
        must(l === len, "expected length " + l + " to be " + len, "expected length " + l + " NOT to be " + len, len);
      },
      toBeGreaterThan: function(n){ must(actual > n, "expected " + stringify(actual) + " to be greater than " + n, "expected " + stringify(actual) + " NOT to be greater than " + n, n); },
      toBeLessThan: function(n){ must(actual < n, "expected " + stringify(actual) + " to be less than " + n, "expected " + stringify(actual) + " NOT to be less than " + n, n); },
      toBeGreaterThanOrEqual: function(n){ must(actual >= n, "expected " + stringify(actual) + " to be >= " + n, "expected " + stringify(actual) + " NOT to be >= " + n, n); },
      toBeLessThanOrEqual: function(n){ must(actual <= n, "expected " + stringify(actual) + " to be <= " + n, "expected " + stringify(actual) + " NOT to be <= " + n, n); },
      toBeInstanceOf: function(ctor){ must(actual instanceof ctor, "expected " + stringify(actual) + " to be instance of " + ctor.name, "expected " + stringify(actual) + " NOT to be instance of " + ctor.name); },
      toThrow: function(match){
        if (typeof actual !== "function") throw AssertionError("toThrow() requires a function as the received value");
        var threw = false, error = null;
        try { actual(); } catch (e) { threw = true; error = e; }
        var pass = threw;
        if (threw && match) {
          var msg = error && error.message ? error.message : String(error);
          if (typeof match === "string") pass = msg.indexOf(match) !== -1;
          else if (match instanceof RegExp) pass = match.test(msg);
        }
        must(pass, "expected function to throw" + (match ? (" matching " + stringify(match)) : ""), "expected function NOT to throw", match);
      },
      get not(){ return makeMatchers(actual, !isNot); }
    };
    return matchers;
  }

  function pgExpect(actual){ return makeMatchers(actual, false); }

  function collect(source){
    var registry = [];
    var suiteStack = [];
    function describe(name, fn){ suiteStack.push(name); try { fn(); } finally { suiteStack.pop(); } }
    function it(name, fn){ registry.push({ name: name, suite: suiteStack.slice(), fn: fn, skip: false }); }
    it.skip = function(name){ registry.push({ name: name, suite: suiteStack.slice(), fn: null, skip: true }); };

    var collectError = null;
    try {
      var runner = new Function("describe", "it", "expect", source);
      runner(describe, it, pgExpect);
    } catch (e) {
      collectError = e;
    }
    return { collectError: collectError, registry: registry };
  }

  function el(tag, className, text){
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function renderResults(container, collected, results){
    container.innerHTML = "";
    if (collected.collectError) {
      var errBox = el('div', 'playground__error');
      errBox.textContent = (collected.collectError && collected.collectError.message) || String(collected.collectError);
      container.appendChild(errBox);
      return;
    }
    if (!results.length) {
      container.appendChild(el('p', 'playground__placeholder', 'No tests found — write an it(...) block and run again.'));
      return;
    }
    var passed = 0, failed = 0, skipped = 0;
    results.forEach(function(r){
      var line = el('div', 'playground__result playground__result--' + r.status);
      var mark = el('span', 'playground__result-mark', r.status === 'passed' ? '✓' : r.status === 'failed' ? '✗' : '○');
      var name = el('span', 'playground__result-name', (r.suite && r.suite.length ? r.suite.join(' > ') + ' > ' : '') + r.name);
      line.appendChild(mark); line.appendChild(name);
      container.appendChild(line);
      if (r.status === 'passed') passed++;
      else if (r.status === 'skipped') skipped++;
      else {
        failed++;
        var detail = el('div', 'playground__detail');
        var msg = (r.error && r.error.message) || String(r.error);
        detail.textContent = msg;
        container.appendChild(detail);
      }
    });
    var summary = el('div', 'playground__summary');
    summary.innerHTML = '<b>' + passed + ' passed</b>' + (failed ? ', <b style="color:var(--error)">' + failed + ' failed</b>' : '') + (skipped ? ', ' + skipped + ' skipped' : '');
    container.appendChild(summary);
  }

  async function runPlayground(){
    var codeEl = document.getElementById('pgCode');
    var out = document.getElementById('pgOutput');
    var collected = collect(codeEl.value);
    if (collected.collectError) { renderResults(out, collected, []); return; }
    var results = [];
    for (var i = 0; i < collected.registry.length; i++) {
      var t = collected.registry[i];
      if (t.skip) { results.push({ name: t.name, suite: t.suite, status: 'skipped' }); continue; }
      try {
        await t.fn();
        results.push({ name: t.name, suite: t.suite, status: 'passed' });
      } catch (err) {
        results.push({ name: t.name, suite: t.suite, status: 'failed', error: err });
      }
    }
    renderResults(out, collected, results);
  }

  var PRESETS = {
    basic:
'describe("sum()", () => {\n' +
'  it("adds two positive numbers", () => {\n' +
'    expect(1 + 1).toBe(2);\n' +
'  });\n' +
'\n' +
'  it("this one fails on purpose", () => {\n' +
'    expect(2 + 2).toBe(5);\n' +
'  });\n' +
'});\n',
    deep:
'describe("deep equality", () => {\n' +
'  it("compares objects and arrays", () => {\n' +
'    expect({ a: 1, b: [1, 2, 3] }).toEqual({ a: 1, b: [1, 2, 3] });\n' +
'  });\n' +
'\n' +
'  it("catches a real difference", () => {\n' +
'    expect({ a: 1, b: [1, 2, 3] }).toEqual({ a: 1, b: [1, 2, 4] });\n' +
'  });\n' +
'});\n',
    throw:
'describe("exceptions", () => {\n' +
'  function withdraw(balance, amount) {\n' +
'    if (amount > balance) throw new Error("insufficient funds");\n' +
'    return balance - amount;\n' +
'  }\n' +
'\n' +
'  it("throws when the amount is too high", () => {\n' +
'    expect(() => withdraw(100, 500)).toThrow("insufficient funds");\n' +
'  });\n' +
'\n' +
'  it("does not throw for a valid withdrawal", () => {\n' +
'    expect(() => withdraw(100, 40)).not.toThrow();\n' +
'  });\n' +
'});\n'
  };

  var pgCode = document.getElementById('pgCode');
  var pgOutput = document.getElementById('pgOutput');
  var pgRun = document.getElementById('pgRun');
  var pgReset = document.getElementById('pgReset');
  var presetButtons = Array.prototype.slice.call(document.querySelectorAll('.playground__preset'));
  var activePreset = 'basic';

  function loadPreset(name){
    activePreset = name;
    pgCode.value = PRESETS[name];
    presetButtons.forEach(function(b){ b.classList.toggle('playground__preset--active', b.getAttribute('data-preset') === name); });
    pgOutput.innerHTML = '';
    var ph = document.createElement('p');
    ph.className = 'playground__placeholder';
    ph.textContent = 'Results will appear here — click "Run tests".';
    pgOutput.appendChild(ph);
  }

  presetButtons.forEach(function(btn){
    btn.addEventListener('click', function(){ loadPreset(btn.getAttribute('data-preset')); });
  });
  if (pgRun) pgRun.addEventListener('click', runPlayground);
  if (pgReset) pgReset.addEventListener('click', function(){ loadPreset(activePreset); });
  if (pgCode) loadPreset('basic');
})();

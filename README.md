# depin

This is a very simple dependency injection library for javascript. Its flavor is a cross between [AngularJS](https://angularjs.org/) and [AMD](http://requirejs.org/docs/whyamd.html). It doesn't provide any script loading, just dependency resolution and injection.

## Install

Just grab the minified version from here or you can also use bower:

```
bower install depin
```

## It looks like this

```js
depin
    .define("foo", function ()
    {
        return {
            skidoo: 23
        }
    })
    .define("bar", function (foo)
    {
        console.log(foo.skidoo)
    })
```

So basically, an awful lot like AMD except arguments are injected, like angular. You can also run a function with injected arguments:

```js
depin
    .define("add", function ()
    {
        return function (a, b) { return a + b }
    })
    .run(function (add)
    {
        console.log(add(2, 2))
    })
```

Sometimes you might like to organize your modules into submodules. Depin doesn't really support this but you can put dots in module names and they will be mapped to underscores in function arguments. I know, fancy.

```js
depin
    .define("foo.bar", function () { return "Hats aren't food" })
    .run(function (foo_bar)
    {
        console.log(foo_bar == "Hats aren't food")
    })
```

## Structuring an app

If you organize your code this way, you can use a `depin.run` call as the main entry to your application. Like so...

```
depin.define("stuff", function () { ... })
depin.define("things", function () { ... })

document.addEventListener('DOMContentLoaded', function()
{
    depin.run(function (stuff, things)
    {
    })
}, false)
```

That's it. Have a nice day.
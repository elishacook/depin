describe("depin", function ()
{
    beforeEach(function ()
    {
        depin.clear()
    })
    
    it("can add a module to a list", function ()
    {
        var setupFoo = function (a, b) {}
        depin.define('foo', setupFoo)
        var m = depin.modules.foo
        expect(m.isSetup).toBe(false)
        expect(m.setup).toEqual(setupFoo)
    })
    
    it("can extract dependency names from functions", function ()
    {
        var fn = function (foo_bar_baz, goo) {}
        var deps = depin.extractDependencies(fn)
        expect(deps).toEqual(['foo.bar.baz', 'goo'])
    })
    
    it("will return an empty list when trying to extract dependencies from a function without arguments", function ()
    {
        var deps = depin.extractDependencies(function () {})
        expect(deps).toEqual([])
    })
    
    it("can retrieve a module that has been defined", function ()
    {
        depin.define("foo", function ()
        {
            return 23
        })
        
        var foo = depin.get("foo")
        expect(foo).toEqual(23)
    })
    
    it("can inject dependencies into a module's setup function", function ()
    {
        var flag = 'nobody'
        
        depin.define("foo", function () { flag = 'foo' })
        depin.define("bar", function (foo)
        {
            expect(flag).toEqual('foo')
            flag = 'bar'
        })
        
        var bar = depin.get('bar')
        expect(flag).toEqual('bar')
    })
    
    it("can inject dependencies into an abitrary function and run it", function ()
    {
        depin
            .define("foo", function () { return 23 })
            .run(function (foo)
            {
                expect(foo).toEqual(23)
            })
            .run(function (foo)
            {
                expect(foo).toEqual(23)
            })
    })
    
    it("can inject into an arbitrary function retrning a new function", function ()
    {
        depin.define("foo", function () { return 23 })
        
        var fn = depin.inject(function (foo)
        {
            return foo
        })
        expect(fn()).toEqual(23)
    })
    
    it("will fail to load a module if it has a missing dependency", function ()
    {
        depin.define("foo", function (bar) {})
        expect(function ()
        {
            depin.run(function (foo){})
        }).toThrow("No module called 'bar' has been defined.")
    })
    
    it("will fail to run a function if it has a missing dependency", function ()
    {
        expect(function ()
        {
            depin.run(function (foo){})
        }).toThrow("No module called 'foo' has been defined.")
    })
    
    it("won't let a module be defined twice", function ()
    {
        depin.define("foo", function (){})
        expect(function ()
        {
            depin.define("foo", function (){})
        }).toThrow("The module called 'foo' was already defined.")
    })
    
    it("delays resolving depenencies until required", function ()
    {
        var spy = jasmine.createSpy('dummy'),
            fn = depin.inject(function (foo)
        {
            spy(foo)
        })
        
        expect(spy).not.toHaveBeenCalled()
        
        depin.define('foo', function () { return 23 })
        fn()
        expect(spy).toHaveBeenCalledWith(23)
    })
})
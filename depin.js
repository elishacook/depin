(function (){ 'use strict';

window.depin =
{
    modules: {},
    
    define: function (name, setup)
    {
        if (this.modules[name])
        {
            throw new Error("The module called '"+name+"' was already defined.")
        }
        
        this.modules[name] = {
            setup: setup,
            isSetup: false,
            value: null
        }
        
        return this
    },
    
    get: function (name)
    {
        var m = this.modules[name]
        
        if (!m)
        {
            return null
        }
        
        if (!m.isSetup)
        {
            m.isSetup = true
            m.value = this.run(m.setup)
        }
        
        return m.value
    },
    
    run: function (fn)
    {
        var deps = this.extractDependencies(fn)
        
        if (deps.length > 0)
        {
            var args = deps.map(function (depName)
            {
                if (!this.modules[depName])
                {
                    throw new Error("No module called '"+depName+"' has been defined.")
                }
                return this.get(depName)
            }.bind(this))
            return fn.apply(undefined, args)
        }
        else
        {
            return fn()
        }
        
        return this
    },
    
    clear: function ()
    {
        this.modules = {}
    },
    
    resolveDependencies: function ()
    {
        
    },
    
    extractDependencies: function (fn)
    {
        var args = this.extractArguments(fn)
        return args.map(function (a) { return a.replace(/_/g, '.') })
    },
    
    extractArguments: function (fn)
    {
        var pat = /^function\s*[^\(]*\(\s*([^\)]*)\)/m
        var argStr = fn.toString().match(pat)[1]
        
        if (argStr.trim() === '')
        {
            return []
        }
        else
        {
            return argStr.split(',').map(function (s) { return s.trim() })
        }
    }
}

})()
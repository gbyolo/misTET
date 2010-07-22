<h2>Modules</h2>

misTET is also a modular cms. 
to create a new module, just go into /modules, create a folder and 
within the folder a .js file both with the same name of the module. Then
edit /res/files/modules.xml and add your new module.

`moduleName.js`:

`misTET.resources.modules.create("name", {
    initialize: function (/*...*/) { /*...*/ },
    execute: function (/*...*/) { /*...*/ },
    /* ... */
});
`

The `execute` function will be executed
when you want, or, if the module should show its output in a page like
`module=moduleName`, when you load the page.

This is the *main* file of your module. The initialize function is executed while the module is loading. Then you can put all the functions you need.

If the module uses a XML file(or something else) as a global variable, so after you've loaded it you want to put the XML resource in a variable, you should use misTET.res, alias for misTET.resource as follows:

`misTET.res.create("name", { globalResource: { } });`

Then, when you load your XML file, you save it in misTET.res[name].globalResource, and you can use it whenever you want.

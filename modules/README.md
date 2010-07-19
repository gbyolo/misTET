<h2>Modules</h2>

misTET is also a modular cms. 
to create a new module, just go into /modules, create a folder and 
within the folder a .js file both with the same name of the module. Then
edit /res/files/modules.xml and add your new module.

`moduleName.js`:

`misTET.modules.moduleName = {
    initialize: function() { /*...*/ }
    /* ... */
}
`

This is the *main* file of your module. The initialize function is executed while the module is loading. Then you can put all the functions you need.
Now save the file, and enjoy it!

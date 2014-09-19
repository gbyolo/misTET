#!/usr/bin/python
#
# misTET compiler
# You need this: http://closure-compiler.googlecode.com/files/compiler-latest.zip
# then extract compiler.jar in this folder
# You need also java (latest version)

# This file is part of misTET
# read /COPYING for more information

import os
import sys
import subprocess

COMPILER = "java -jar compiler.jar" # --compilation_level ADVANCED_OPTIMIZATIONS
tmp = "tmp"

def comp (file, directory, out=False):
    if (not out):
        out = "%s.min.js" % (file[:-3])

    fnull = hook_tmp(str(tmp)) # or subprocess.PIPE
    error = False
    try:
        retcode = subprocess.call("%s --js %s/%s --js_output_file %s/%s" % (COMPILER, directory, file, directory, out), shell=True, \
                                  stderr=subprocess.STDOUT, stdout=fnull)
        if retcode < 0:
            sys.stderr.write("compiler.jar was terminated with signal", retcode)
            error = True
        elif retcode > 0:
            sys.stderr.write("Error while compiling %s\nTake a look at tmp for further information\n" % str(file)) 
            error = True
    except OSError, e:
        sys.stderr.write("Failed to run compiler.jar\n", e)
        error = True

    fnull.close()
    if error:
        # Unable to compile a file, exit
        exit(retcode)

def header (file):   
    if os.access(file, os.R_OK):
        content = open(file, "r").read()
    else:
        return False

    if os.access(file, os.W_OK):
        head = "/* Copyleft gbyolo [gb.yolo@gmail.com]. This file is part of misTET, released under under AGPLv3. */"
        fd = open(file, "w");
        fd.write("%s\n%s" % (head, content))
        fd.close()
        return True
    else:
        return False

def hook_tmp (file):
    try:
        fnull = open(file, "w")
    except e:
        fnull = open(os.devnull, "w")
    return fnull

def del_tmp (file):
    if (os.path.exists(file)):
        try:
            os.remove(file)
        except OSError, e:
            sys.stderr.write(e)

if __name__ == "__main__":
    framework = [fname for fname in os.listdir("system/framework/") if (os.path.isfile(os.getcwd() + "/system/framework/" + fname) and fname[len(fname)-2:len(fname)] == "js")]

    print "Compiling system/mistet.js"
    comp ("mistet.js", "system")
    header("system/mistet.min.js")

    for file in framework:
        print "Compiling system/framework/%s" % str(file)
        comp(file, "system/framework")
        header("system/framework/%s.min.js" % (file[:-3]))

    del_tmp(str(tmp))
    print "misTET compiled successfully"

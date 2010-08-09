#! /bin/sh
#
# misTET compiler
# You need this: http://closure-compiler.googlecode.com/files/compiler-latest.zip
# Then extract compiler.jar in this folder
# You need also java

compiler="java -jar compiler.jar"

corepath="system"
core="$corepath/mistet.js"
utils="$corepath/utils.js"
prototype="$corepath/prototype.js"

TMP="/tmp/mistet"
MODULES="modules"

codes=($core $utils $prototype)

# Simple function to hook a tmp file
hook_tmp() {
        
    if [ -f $1 -o -e $1 ]; then
        rm -f $1
    fi
        
    touch $1
    chmod 0600 $1 || {
        error "\033[1;31m'Unable to chmod ${TMP} \033][0m\]"
        exit -1
    }
        
}

# Unhook the hooked tmp file
unhook_tmp() {
        
    if [ -e $1 ]; then
        rm -f $1
    fi
        
}

# Error
error() {
    echo -ne "\e[1;31m${1}\e\n[0m"
}

# New section of compiling
sec() {
    echo -e "\e[1;32m${1}\e\n[0m"
}

sec "Compiling core and dependencies..."

for i in ${!codes[@]}
do
    # File exists and file size is not 0
    if [ -a ${codes[i]} -a -s ${codes[i]} ]; then
        # File must not be a directory
        # (if you have a directory named mistet.js, kill yourself)
        if [ -d ${codes[i]} ]; then
            error "'${codes[i]}' is a directory. It must be a file "
            exit -1
        fi
        # has read permissions
        if [ -r ${codes[i]} ]; then
            continue
        # hasn't read permission
        else
            error "'${codes[i]}' must have read permission "
            exit -1
        fi
        continue
    else
        error "'${codes[i]}' doesn't exist "
        exit -1
    fi
done

echo "Compiling ${core}"
echo "$compiler --js '$core' --js_output_file 'tmp.js'"

# Hook tmp js file
hook_tmp "tmp.js"

$compiler --js $core --js_output_file 'tmp.js' || {
    error "Failed to compile $core"
    unhook_tmp "tmp.js"
    exit -1
}

#Unhook compiled file
unhook_tmp "tmp.js"

echo "Compiling utils"
echo "$compiler --js '$utils' --js_output_file 'tmp.js'"

hook_tmp "tmp.js"
$compiler --js $utils --js_output_file 'tmp.js' || {
    error "Failed to compile $utils"
    unhook_tmp "tmp.js"
    exit -1
}

unhook_tmp "tmp.js"

echo "Compiling prototype"
echo "$compiler --js '$prototype' --js_output_file 'tmp.js'"

hook_tmp "tmp.js"

$compiler --js $prototype --js_output_file 'tmp.js' || {
    error "Failed to compile $prototype"
    unhook_tmp "tmp.js"
    exit -1
}

unhook_tmp "tmp.js"

sleep 2
sec "Finding modules to be compiled..."

# Find js files and save them in ${TMP}
find ${MODULES} -type f -name "*.js" >> ${TMP} 2> /dev/null
# Get each file and compile it
cat -- ${TMP} | while read TARGET; do

    echo "Found file: ${TARGET}. Compiling..."
    echo "$compiler --js '${TARGET}' --js_output_file 'tmp.js'"
    # Hook tmp js file to compile
    hook_tmp "tmp.js"

    # Start compiling
    $compiler --js $TARGET --js_output_file 'tmp.js' || {
        error "Failed to compile ${TARGET}"
        exit -1
    }
    # Unhook tmp js file
    unhook_tmp "tmp.js"
        
done

echo "Unhooking tmp file"
# Unhook /tmp/mistet
unhook_tmp ${TMP}
# Unhooking tmp.js
unhook_tmp "tmp.js"

sec "misTET has been compiled successful"

exit 0

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

codes=($core $utils $prototype)

echo "Checking core and dependencies..."

for i in ${!codes[@]}
do
	# File exists and file size is not 0
	if [ -a ${codes[i]} -a -s ${codes[i]} ]; then
		# File must not be a directory
		# (if you have a directory named mistet.js, kill yourself)
		if [ -d ${codes[i]} ]; then
			echo -e "\033[1;31m'${codes[i]}' is a directory. It must be a file \033][0m\]"
			exit -1
		fi
		# has read permissions
		if [ -r ${codes[i]} ]; then
			continue
		# hasn't read permission
		else
			echo -e "\033[1;31m'${codes[i]}' must have read permission \033][0m\]"
			exit -1
		fi
		continue
	else
		echo -e "\033[1;31m'${codes[i]}' doesn't exist \033][0m\]"
		exit -1
	fi
done

echo "Compiling core"
echo "$compiler --js '$core' --js_output_file 'tmp.js'"

$compiler --js $core --js_output_file 'tmp.js' || {
	echo -e "\033[1;31mFailed to compile $core \033][0m\]"
	exit -1
}

echo "Compiling utils"
echo "$compiler --js '$utils' --js_output_file 'tmp.js'"

$compiler --js $utils --js_output_file 'tmp.js' || {
	echo -e "\033[1;31mFailed to compile $utils \033][0m\]"
	exit -1
}

echo "Compiling prototype"
echo "$compiler --js '$prototype' --js_output_file 'tmp.js'"

$compiler --js $prototype --js_output_file 'tmp.js' || {
	echo -e "\033[1;31mFailed to compile $prototype \033][0m\]"
	exit -1
}

echo "misTET has been compiled successful"
exit 0



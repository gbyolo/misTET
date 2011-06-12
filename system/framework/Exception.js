/**************************************************************************** 
 * Copyleft lostpassword                                                    * 
 * [gdb.lost@gmail.com]                                                     *
 *                                                                          *
 * This file is part of misTET.                                             *
 *                                                                          *
 * misTET is free software: you can redistribute it and/or modify           *
 * it under the terms of the GNU Affero General Public License as           *
 * published by the Free Software Foundation, either version 3 of the       *
 * License, or (at your option) any later version.                          *
 *                                                                          *
 * misTET is distributed in the hope that it will be useful,                *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of           *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the            *
 * GNU Affero General Public License for more details.                      *
 *                                                                          *
 * You should have received a copy of the GNU Affero General Public License *
 * along with misTET.  If not, see <http://www.gnu.org/licenses/>.          *
 ****************************************************************************/

/* Cross-Browser stuff */
(function () {

    Object.extend(Error.prototype, (function () {

        function fix () {
            this.message = (this.message || this.description);
            this.file = this.fileName.strip();
            this.line = String(this.lineNumber);
            this.stack = (this.stack.strip() || "");
        }
        return { fix: fix };

    })());  

    if (Prototype.Browser.IE) {
        Error.prototype.toString = function () {
            return "#{name}: #{description}\n#{stack}".interpolate({
                name: this.name,
                description: this.description,
                stack: (this.stack || "") /* stack: @file: line */
            });
        };
    } else if (Prototype.Browser.Gecko) {
        Error.prototype.toString = function () {
            return "#{name}: #{message}\n#{stack}".interpolate({
                name: this.name,
                message: this.message,
                stack: (this.stack || "")
            });
        };
    } else if (Prototype.Browser.Chrome || Prototype.Browser.Safari) {
        Error.prototype.toString = function () {
            return '#{name}: #{message}\n#{stack}'.interpolate({
                name: this.name,
                message: this.message,
                stack: (this.stack || "")
            });
        };
    } else if (Prototype.Browser.Opera) {
        Error.prototype.toString = function () {
            return '#{name}: #{message}'.interpolate({
                name: this.name,
                message: this.message
            });
        };
    }
})();

(function () {
    if (!Object.isset(misTET)) {
        misTET = new Object();  
    }
})();

function _isException (object) {

    var result = true;
    result = (!typeof(object) == "object" ||
              !object.constructor === Object) ? false : true;

    if (!Object.isset(object.name) ||
        !Object.isset(object.message) ||
        !Object.isset(object.file) ||
        !Object.isset(object.line)) {
        result = false;
    }

    if (!Object.isString(object.name) ||
        !Object.isString(object.message) ||
        !Object.isString(object.file) ||
        !Object.isString(object.line)) {
        result = false;
    }

    return result;
}

function _fixException (exception) {

    exception.name = (exception.name || "Error");
    exception.message = (exception.message || "");
    exception.file = (exception.file || "");
    exception.line = (exception.line || "");

    return exception;
}

misTET.exception = Class.create({

    initialize: function (exception) {

        if (!Object.isset(exception)) {
            exception = new Object();
        }
        if (!_isException(exception)) {
            if (Object.isString(exception)) {
                exception = _fixException({message: exception});
            } else {
                exception = _fixException(exception);
            }
        }

        Object.extend(this, exception);
        return true;
    },

    handle: function () {
   
        if (!Object.isset(this) || !Object.isset(misTET)) {
            return false;
        }
        misTET.$error = true;
        Event.fire(document, ":error", this);

        var result = "#{name}: #{message}\n".interpolate(this);
        result += this.file.isEmpty() ? "" : "@#{file}".interpolate(this);
        result += this.line.isEmpty() ? "" : " :#{line}".interpolate(this);
        window.alert(result);

    }       
});

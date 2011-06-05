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

function _isException (object) {

    var result = true;
    result = (!typeof(object) == "object" ||
              !object.constructor === Object) ? false : true;

    if (!Object.isset(object.description) ||
        !Object.isset(object.file) ||
        !Object.isset(object.line)) {
        result = false;
    }

    if (!Object.isString(object.description) ||
        !Object.isString(object.file) ||
        !Object.isString(object.line)) {
        result = false;
    }

    return result;
}

function _fixException (exception) {

    if (!Object.isset(exception.description)) {
        exception.description = "Error";
    }
    if (!Object.isset(exception.file)) {
        exception.file = "Undefined file";
    }
    if (!Object.isset(exception.line)) {
        exception.line = "Undefined line";
    }

    exception.description = exception.description.isEmpty() ? "Error" : exception.description;
    exception.file = exception.file.isEmpty() ? "Undefined file" : exception.file;
    exception.line = exception.line.isEmpty() ? "Undefined line" : exception.line;
}

misTET.exception = Class.create({

    initialize: function (exception) {

        if (!Object.isset(exception)) {
            exception = new Object();
        }
        if (!_isException(exception)) {
            _fixException(exception);
        }

        Object.extend(this, exception);
        return true;
    }
        
});

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

/** Blog feed **/

(function() {

    var Feed = Class.create({
                
        /** set up rss data **/
        initialize: function (data) {
                        
            if (!Object.isset(data)) {
                misTET.errors.create({
                    name: "feed initialize",
                    message: "wrong number of arguments(0 of 1)"
                });
                                
                return false;
            }
                        
            if (Object.isset(data) && !Object.isset(data.root)) {
                                
                misTET.errors.create({
                    name: "feed initialize",
                    message: "root path is missing",
                });
                                
                return false;
            }
          
            /** path and rss **/
            this.root = data.root;
            this.path = data.path || "feed.xml";
            this.version = data.version || "2.0";
                        
            /** site **/
            this.title = data.title || misTET.config.title;
            this.description = data.description || "#{title} rss feed".interpolate({ title: this.title});
            /** default language is english **/
            this.language = data.language || "en-us";
        },
                
        /** re-generate rss feed **/
        update: function (data) {
                        
            var data = { file: this.path, data: this.rss(data) };                
            new Ajax.Request(this.root + "/system/blog.php?feed&", {
                method: "post",
                parameters: data,
                                
                onFailure: function (http) {
                    misTET.errors.create("feed: #{status} - #{statusText}.".interpolate(http));
                }
            });
        },
                
        /** create rss content **/
        rss: function (data) {
                        
            var posts = $A(data.documentElement.getElementsByTagName('post'));
            var len = posts.length;
                        
            var result = ( "<?xml version='1.0' encoding='utf-8' ?>\n" +
                                "<rss version='#{version}'>\n" +
                                    "<channel>\n" +
                                        "<title><![CDATA[#{title}]]></title>\n" +
                                        "<description><![CDATA[#{description}]]></description>\n" +
                                        "<link><![CDATA[#{link}]]></link>\n" +
                                        "<language>#{language}</language>\n" +
                                        "<webMaster>#{webmaster}</webMaster>\n").interpolate({
                                            
                                            version: this.version,
                                            title: this.title,
                                            description: this.description,
                                            link: "#{root}/#module=blog".interpolate(misTET),
                                            language: this.language,
                                            v: misTET.modules.blog.version,
                                            webmaster: misTET.res.blog.author
                                        });
                        
                posts.each(function (pos) {
                    var post = misTET.modules.blog.getPost(pos.getAttribute('id'));
                    result += ( "<item>\n" +
                                        "<title><![CDATA[#{title}]]></title>\n" +
                                        "<description><![CDATA[#{description}]]></description>\n" +
                                        "<link><![CDATA[#{link}]]></link>\n" +
                                        "<pubDate>#{date}</pubDate>" +
                                    "</item>").interpolate({
                                        
                                        title: post.title,
                                        description: post.text,
                                        link: "#{root}/#module=blog&id=#{id}".interpolate({ root: misTET.root, id: post.id }),
                                        date: post.date
                                    });
                });
                        
                result += "</channel>\n</rss>"
                return result;
                        
            }
                                
                
    });

    return Feed;

})();

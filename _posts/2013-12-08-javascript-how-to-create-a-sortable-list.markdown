---
layout: post
status: publish
published: true
title: Javascript - How to create a sortable list
date: '2013-12-08 15:55:58 -0800'
date_gmt: '2013-12-08 23:55:58 -0800'
categories:
- Development
tags:
- javascript
- jquery
- jquery ui
- sortable
- list
- html
comments: true
---
<p>I needed to create a sortable list within a webpage that also made sure it updated the order of that list via the id of the form input.  Below is the javascript and html page and this is the <a href="http://jsfiddle.net/nictrix/AbAtJ/3/" title="jsfiddle">jsfiddle</a> showing how it works.</p>
<p>Here is the html:</p>

{% highlight html %}
<h4>Order of your favorite Animals</h4><br />
<div id='sort-list'>
  <div id='listItem_1'>
    <li>dog<input id='1' type='text' name='1' value='1'/></li>
  </div>
  <div id='listItem_2'>
      <li>cat<input id='2' type='text' name='2' value='2'/></li>
  </div>
  <div id='listItem_3'>
      <li>mouse<input id='3' type='text' name='3' value='3'/></li>
  </div>
</div>
{% endhighlight %}

<p>Here is the javascript, you also need to use jquery and jquery UI (sortable)</p>

{% highlight javascript %}
$(function() {
    $( '#sort-list' ).sortable({
        stop: function (event, ui) {
            var inputs = $('input');
            var input_length = inputs.length;
             $($("input").get().reverse()).each(function(idx) {
                var newvalue = $(input_length - idx);
                $(this).attr('id',$(newvalue)[0]);
                $(this).attr('name',$(newvalue)[0]);
                $(this).attr('value',$(newvalue)[0]);
            });
        }
    });
    $( "#sort-list" ).disableSelection();
});
{% endhighlight %}

<p>Then you can drag and drop the list, you'll also see the values in the form update to the proper number the input is in.  This way it helps when it is submitted.</p>

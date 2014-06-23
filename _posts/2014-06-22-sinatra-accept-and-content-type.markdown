---
layout: post
title: "Sinatra Accept and Content Type"
description: "Quick post on why Sinatra needs to do better with version and accept headers"
category:
  - Development
tags:
  - ruby
  - sinatra
  - http
  - headers
---
<p>
I found it a bit difficult to find Sinatra's proper way of gathering data from HTTP headers, such as Accept, Content Type and User agent.  Once I figured it out it was still not the best piece of work.  As you are required to find the accept header you require or need, then if you want to add the standard version into it, you'll want to parse out the accept parameters.  See below:
</p>

{% highlight ruby %}
  accept = request.accept.find { |x| x =~ /^application\/vnd\.nictrix.net.*?$/i }
  version = accept.params['version'].to_i
{% endhighlight %}

<p>
  As you can see from above the version is taken from the parameters of the accept hash.  Another example is content type and user agent, which are much more straight forward:
</p>

{% highlight ruby %}
  request.content_type
  request.user_agent
{% endhighlight %}

<p>
  Those are much easier to understand and use since they appear to be in the request object itself, most likely coming from rack itself and Sinatra is just making it easier on us.  There should be an easier way to gather the version requested in sinatra as that seems to be the most used standard.
</p>

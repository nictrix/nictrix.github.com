---
layout: post
title: "Cloudflare - free SSL"
description: "How Cloudflare is providing free accounts with universal SSL"
category:
  - Administration
tags:
  - cloudflare
  - github pages
---
<p>
  A post I created a couple months ago talked about how I moved from a single server at Digital Ocean to Github pages service with Cloudflare.  At that time I felt bad for not keeping SSL, since my custom domain would be work with Github pages free SSL service.  But Cloudflare in recent weeks is now providing SSL for free accounts - allowing me to make my default SSL via some javascript.
</p>

<p>
  If you inspect the certificate in your browser, you should see a multitude of domains, looks like they are trying to limit their costs by purchasing a SAN certificate for X amount of sites per certificate (I wonder if their CA blocks from having a certain amount of domains in the certificate request)
</p>

<p>
  Check the Cloudflare blog for more details: https://blog.cloudflare.com/the-little-extra-that-comes-with-universal-ssl/
</p>

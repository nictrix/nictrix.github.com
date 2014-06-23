---
layout: post
status: publish
published: true
title: S3 Bucket - Precise Permissions
date: '2013-11-18 22:54:34 -0800'
date_gmt: '2013-11-19 06:54:34 -0800'
categories:
  - Administration
tags:
- aws
- s3
comments: true
---
<p>Found a way to give precise permissions to prefixes underneath the main bucket.  Create an IAM account, then assign this policy below.  Now you can safety know that the IAM account will only be able to access items underneath the prefix development/, in the my_main_bucket.</p>

{% highlight bash %}
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
       "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::my_main_bucket"
      ],
      "Condition": {
        "StringLike": {
          "s3:prefix": "development/*"
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:*"
      ],
      "Resource": [
        "arn:aws:s3:::my_main_bucket/development/*"
      ],
      "Condition": {}
    }
  ]
}
{% endhighlight %}

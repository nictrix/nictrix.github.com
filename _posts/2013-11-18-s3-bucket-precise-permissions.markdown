---
layout: post
title: S3 Bucket - Precise Permissions
description: "Proper permissions for an S3 user and it's bucket"
categories:
  - Administration
tags:
- aws
- s3
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

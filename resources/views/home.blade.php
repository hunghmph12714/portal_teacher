<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Add To Home</title>
<meta name="viewport" content="width=device-width, initial-scale=1">

<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">

<meta name="apple-mobile-web-app-title" content="Add to Home">

<link rel="shortcut icon" sizes="16x16" href="../../imgs/icon-16x16.png">
<link rel="shortcut icon" sizes="196x196" href="../../imgs/icon-196x196.png">
<!--link rel="apple-touch-icon-precomposed" sizes="152x152" href="icon-152x152.png">
<link rel="apple-touch-icon-precomposed" sizes="144x144" href="icon-144x144.png">
<link rel="apple-touch-icon-precomposed" sizes="120x120" href="icon-120x120.png">
<link rel="apple-touch-icon-precomposed" sizes="114x114" href="icon-114x114.png">
<link rel="apple-touch-icon-precomposed" sizes="76x76" href="icon-76x76.png">
<link rel="apple-touch-icon-precomposed" sizes="72x72" href="icon-72x72.png"-->
<link rel="apple-touch-icon-precomposed" href="../../imgs/icon-152x152.png">

<link rel="stylesheet" type="text/css" href="public/css/aths.css">
<script src="public/js/aths.js"></script>
<script>
addToHomescreen();
</script>
</head>

<body>
<p>This demo tries to detect when the application is added to the homescreen by using a #hash token. You can also use a query string or a smart URL, but they are all guesstimate and there's a 20-30% chances of false positives. The good news is that false negative (ie: the call out being displayed when the app has been already added to the homescreen) should be very rare.</p>
<p>Remember that the only 100% safe way to use the add to homescreen feature is by using the <strong>apple-mobile-web-app-capable</strong> meta tag.</p>
</body>
</html>
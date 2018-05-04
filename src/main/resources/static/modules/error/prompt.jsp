<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head lang="en">
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <link rel="stylesheet" href="../style/style.css" />    
    <title>物联网业务管理平台</title>
</head>
	<body class="unfind-page-bg">
		<div class="unfind-page-wrap">
			<div class="error-pic">
				<i class="unfind-page-icon"></i>
			</div>	
			<h1 class="error-title"></h1>
			<div class="error-content"><%=request.getAttribute("message") %></div>
		</div>	
	</body>
</html>
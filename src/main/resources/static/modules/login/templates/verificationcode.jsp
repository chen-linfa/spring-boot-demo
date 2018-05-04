<%@ page contentType="image/jpeg; charset=utf-8" language="java"
	pageEncoding="utf-8"%>
<%@page import="com.sun.image.codec.jpeg.JPEGCodec"%>
<%@page import="com.sun.image.codec.jpeg.JPEGImageEncoder"%>
<%@page import="java.awt.*,java.awt.image.*,java.util.*,javax.imageio.*"%>
<%!Color getRandColor(int fc, int bc) {//给定范围获得随机颜色
		Random random = new Random();
		if (fc > 255)
			fc = 255;
		if (bc > 255)
			bc = 255;
		int r = fc + random.nextInt(bc - fc);
		int g = fc + random.nextInt(bc - fc);
		int b = fc + random.nextInt(bc - fc);
		return new Color(r, g, b);
	}
	//测试环境验证码显示不了
	static{
	    System.setProperty("java.awt.headless", "true");
	}
	%>
	
<%
	out.clear();//这句针对resin服务器，如果是tomacat可以不要这句
	//设置页面不缓存
	response.setHeader("Pragma", "No-cache");
	response.setHeader("Cache-Control", "no-cache");
	response.setDateHeader("Expires", 0);

    
	// 在内存中创建图象
	int width = 65, height = 43;//////高度 宽度
	BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);

	// 获取图形上下文
	Graphics g = image.getGraphics();

	//生成随机类
	Random random = new Random();

	// 设定背景色
	g.setColor(getRandColor(230, 250));
	g.fillRect(0, 0, width, height);

	//设定字体
	g.setFont(new Font("Time News Roman", Font.ITALIC, 20));

	// 随机产生 100 条干扰线，使图象中的认证码不易被其它程序探测到
	g.setColor(getRandColor(160, 200));
	for (int i = 0; i < 100; i++) {
		int x = random.nextInt(width);
		int y = random.nextInt(height);
		int xl = random.nextInt(12);
		int yl = random.nextInt(12);
		g.drawLine(x, y, x + xl, y + yl);
	}

	// 取随机产生的认证码(4位数字)
	String codeList = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

	String sRand = "";

	for (int i = 0; i < 4; i++) {
		int a = random.nextInt(codeList.length() - 1);
		String rand = codeList.substring(a, a + 1);
		sRand += rand;
		// 将认证码显示到图象中
		g.setColor(new Color(20 + random.nextInt(110), 20 + random.nextInt(110), 20 + random.nextInt(110)));
		g.drawString(rand, 13 * i + 7, 30);
	}

	// 将认证码存入SESSION //SECURITYCODEKEY  verifyCode
	session.setAttribute("verifyCode", sRand);
	//System.out.print(sRand+";");
	// 图象生效
	g.dispose();
	// 输出图象到页面
	//ImageIO.write(image, "JPEG", response.getOutputStream());
	JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(response.getOutputStream());
	encoder.encode(image);
	out.clear();
	out = pageContext.pushBody();
%>
package com.ztesoft.springboot.interceptor;

        import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
        import org.springframework.web.context.WebApplicationContext;

        import javax.servlet.ServletContext;
        import javax.servlet.ServletException;

public class MyAdditionListeners extends SpringBootServletInitializer {
    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        WebApplicationContext rootAppContext = createRootApplicationContext(servletContext);
        if (rootAppContext != null) {
            //servletContext.addListener(new MyListener());
        } else {
        }
    }
}

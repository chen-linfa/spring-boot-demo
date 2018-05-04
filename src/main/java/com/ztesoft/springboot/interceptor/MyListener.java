package com.ztesoft.springboot.interceptor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextListener;

/**
 * 定义监听器
 */
public class MyListener {
    @Bean
    public RequestContextListener requestContextListener() {
        return new RequestContextListener();
    }
}

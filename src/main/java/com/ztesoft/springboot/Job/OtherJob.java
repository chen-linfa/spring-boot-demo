package com.ztesoft.springboot.Job;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;

@Component
public class OtherJob implements Job {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    public void execute(JobExecutionContext context) {
        SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        log.info(context.getJobDetail().getKey() + ":" + f.format(new Date()) + "正在执行Job executing...");
    }
}
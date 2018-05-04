package com.ztesoft.springboot.Job;

import com.ztesoft.springboot.domain.JobInfo;
import org.quartz.*;
import org.quartz.impl.StdScheduler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.quartz.CronTriggerFactoryBean;
import org.springframework.scheduling.quartz.JobDetailFactoryBean;

import java.text.ParseException;

@SuppressWarnings({"rawtypes", "unchecked"})
public class SchedulerUtil {

    private static Logger log = LoggerFactory.getLogger(SchedulerUtil.class);

    //CronTrigger的工厂类
    private static CronTriggerFactoryBean cronFactoryBean = new CronTriggerFactoryBean();
    //JobDetail的工厂类
    private static JobDetailFactoryBean jobDetailFactory = new JobDetailFactoryBean();
    //自动注入Spring Bean的工厂类
    private static AutoWiringSpringBeanJobFactory jobFactory = new AutoWiringSpringBeanJobFactory();

    /**
     * 创建定时任务，根据参数，创建对应的定时任务，并使之生效
     *
     * @param config
     * @param context
     * @param stdScheduler
     * @return
     */
    public static boolean createScheduler(JobInfo config, ApplicationContext context, StdScheduler stdScheduler) {
        try {
            //创建新的定时任务
            return create(config, context, stdScheduler);
        } catch (Exception e) {
            log.error("createScheduler", e);
        }
        return false;
    }

    /**
     * 删除旧的定时任务，创建新的定时任务
     *
     * @param oldConfig
     * @param config
     * @param context
     * @param stdScheduler
     * @return
     */
    public static Boolean modifyScheduler(JobInfo oldConfig, JobInfo config, ApplicationContext context, StdScheduler stdScheduler) {
        if (oldConfig == null || config == null || context == null) {
            return false;
        }
        try {
            /*String old_job_name = oldConfig.getJob_name();
            String old_group_name = oldConfig.getJob_group();
            //1、清除旧的定时任务
            delete(old_job_name, old_group_name, stdScheduler);
            //2、创建新的定时任务
            return create(config, context, stdScheduler);*/

            TriggerKey triggerKey = new TriggerKey(config.getJob_name(), config.getJob_group());
            Trigger trigger = stdScheduler.getTrigger(triggerKey);

            ScheduleBuilder scheduleBuilder = null;
            if (trigger != null) {
                if (trigger instanceof CronTrigger) {
                    //表达式调度构建器
                    scheduleBuilder = CronScheduleBuilder.cronSchedule(config.getCron_expression());

                    //按新的cronExpression表达式重新构建trigger
                    TriggerBuilder triggerBuilder = trigger.getTriggerBuilder().withIdentity(triggerKey);
                    triggerBuilder = triggerBuilder.withSchedule(scheduleBuilder);
                    //放入参数，运行时的方法可以获取
                    JobDataMap jobDataMap = new JobDataMap();
                    jobDataMap.put("schedule_job", config);
                    triggerBuilder = triggerBuilder.usingJobData(jobDataMap);

                    trigger = triggerBuilder.build();

                    //按新的trigger重新设置job执行
                    stdScheduler.rescheduleJob(triggerKey, trigger);

                    return true;
                }
            }
        } catch (SchedulerException e) {
            log.error("modifyScheduler", e);
        } catch (Exception e) {
            log.error("modifyScheduler", e);
        }
        return false;
    }

    /**
     * 删除定时任务配置
     *
     * @param config
     * @param context
     * @param stdScheduler
     * @return
     */
    public static Boolean deleteScheduler(JobInfo config, ApplicationContext context, StdScheduler stdScheduler) {
        if (config == null) {
            return false;
        }
        try {
            return delete(config.getJob_name(), config.getJob_group(), stdScheduler);
        } catch (SchedulerException e) {
            log.error("deleteScheduler", e);
        } catch (Exception e) {
            log.error("deleteScheduler", e);
        }
        return false;
    }

    /**
     * 提取的删除任务的方法
     *
     * @param oldName
     * @param oldGroupName
     * @param stdScheduler
     * @return
     * @throws SchedulerException
     */
    private static Boolean delete(String oldName, String oldGroupName, StdScheduler stdScheduler) throws SchedulerException {
        TriggerKey key = new TriggerKey(oldName, oldGroupName);
        //根据TriggerKey获取trigger是否存在，如果存在则根据key进行删除操作
        Trigger keyTrigger = stdScheduler.getTrigger(key);
        if (keyTrigger != null) {
            stdScheduler.unscheduleJob(key);
        }
        return true;
    }

    /**
     * 提取出的创建定时任务的方法
     *
     * @param config
     * @param context
     * @param stdScheduler
     * @return
     */
    private static Boolean create(JobInfo config, ApplicationContext context, StdScheduler stdScheduler) {
        try {
            //创建新的定时任务
            String jobClassStr = config.getJob_class_name();
            Class clazz = Class.forName(jobClassStr);
            String name = config.getJob_name();
            String groupName = config.getJob_group();
            String description = config.toString();
            String time = config.getCron_expression();

            JobDetail jobDetail = createJobDetail(clazz, name, groupName, description);
            if (jobDetail == null) {
                return false;
            }
            Trigger trigger = createCronTrigger(jobDetail,
                    time, name, groupName, description);
            if (trigger == null) {
                return false;
            }

            jobFactory.setApplicationContext(context);
            stdScheduler.setJobFactory(jobFactory);
            stdScheduler.scheduleJob(jobDetail, trigger);

            if (!stdScheduler.isShutdown()) {
                stdScheduler.start();
            }
            return true;
        } catch (ClassNotFoundException e) {
            log.error("create", e);
        } catch (SchedulerException e) {
            log.error("create", e);
        } catch (Exception e) {
            log.error("create", e);
        }
        return false;
    }

    /**
     * 暂停定时任务
     *
     * @param config
     * @param context
     * @param stdScheduler
     * @return
     */
    public static Boolean pause(JobInfo config, ApplicationContext context, StdScheduler stdScheduler) {
        try {
            String job_name = config.getJob_name();
            String job_group = config.getJob_group();
            JobKey jobKey = JobKey.jobKey(job_name, job_group);
            if (jobKey != null) {
                stdScheduler.pauseJob(jobKey);
                return true;
            }
        } catch (SchedulerException e) {
            log.error("pause", e);
        } catch (Exception e) {
            log.error("pause", e);
        }
        return false;
    }

    /**
     * 恢复定时任务
     *
     * @param config
     * @param context
     * @param stdScheduler
     * @return
     */
    public static Boolean resume(JobInfo config, ApplicationContext context, StdScheduler stdScheduler) {
        try {
            String job_name = config.getJob_name();
            String job_group = config.getJob_group();
            JobKey jobKey = JobKey.jobKey(job_name, job_group);
            if (jobKey != null) {
                stdScheduler.resumeJob(jobKey);
                return true;
            }
        } catch (SchedulerException e) {
            log.error("resume", e);
        } catch (Exception e) {
            log.error("resume", e);
        }
        return false;
    }

    /**
     * 立即执行定时任务
     *
     * @param config
     * @param context
     * @param stdScheduler
     * @return
     */
    public static Boolean triggerJob(JobInfo config, ApplicationContext context, StdScheduler stdScheduler) {
        try {
            String job_name = config.getJob_name();
            String job_group = config.getJob_group();
            JobKey jobKey = JobKey.jobKey(job_name, job_group);
            if (jobKey != null) {
                stdScheduler.triggerJob(jobKey);
                return true;
            }
        } catch (SchedulerException e) {
            log.error("triggerJob", e);
        } catch (Exception e) {
            log.error("triggerJob", e);
        }
        return false;
    }

    /**
     * 根据指定的参数，创建JobDetail
     *
     * @param clazz
     * @param name
     * @param groupName
     * @param description
     * @return
     */
    public static JobDetail createJobDetail(Class clazz, String name,
                                            String groupName, String description) {
        jobDetailFactory.setJobClass(clazz);
        jobDetailFactory.setName(name);
        jobDetailFactory.setGroup(groupName);
        jobDetailFactory.setDescription(description);
        jobDetailFactory.setDurability(true);
        jobDetailFactory.afterPropertiesSet();
        return jobDetailFactory.getObject();
    }

    /**
     * 根据参数，创建对应的CronTrigger对象
     *
     * @param job
     * @param time
     * @param name
     * @param groupName
     * @param description
     * @return
     */
    public static CronTrigger createCronTrigger(JobDetail job, String time, String name, String groupName,
                                                String description) {
        cronFactoryBean.setName(name);
        cronFactoryBean.setJobDetail(job);
        cronFactoryBean.setCronExpression(time);
        cronFactoryBean.setDescription(description);
        cronFactoryBean.setGroup(groupName);
        try {
            cronFactoryBean.afterPropertiesSet();
        } catch (ParseException e) {
            log.error("createCronTrigger", e);
        }
        return cronFactoryBean.getObject();
    }
}

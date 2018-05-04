package com.ztesoft.springboot.service;

import com.ztesoft.springboot.Job.SchedulerUtil;
import com.ztesoft.springboot.common.Const;
import com.ztesoft.springboot.common.PageModel;
import com.ztesoft.springboot.common.message.ResponseResult;
import com.ztesoft.springboot.domain.JobInfo;
import com.ztesoft.springboot.utils.DaoUtils;
import com.ztesoft.springboot.utils.DateUtil;
import com.ztesoft.springboot.utils.SpringUtils;
import com.ztesoft.springboot.utils.StringUtils;
import org.apache.commons.beanutils.BeanUtils;
import org.quartz.*;
import org.quartz.impl.StdScheduler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@SuppressWarnings({"rawtypes", "unchecked"})
public class JobService {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private ApplicationContext applicationContext;

    @Transactional
    public PageModel<JobInfo> queryJobInfo(Map<String, Object> params) {
        int page = (Integer) params.get("page");
        int rows = (Integer) params.get("rows");
        return DaoUtils.selectPageModel("Job.queryJobInfo", params, page, rows);
    }

    @Transactional
    public ResponseResult saveJobInfo(JobInfo jobInfo) throws Exception {
        ResponseResult result = new ResponseResult(Const.CODE_INFO.CODE_00000);
        Map<String, Object> form_validate = validateJobInfo(jobInfo);
        if (!form_validate.isEmpty()) {
            result.setCodeInfo(Const.CODE_INFO.CODE_40000);
            result.setResult(form_validate);
            return result;
        }
        StdScheduler stdScheduler = SpringUtils.getBean("schedulerFactoryBean");
        if (StringUtils.isBlank(jobInfo.getJob_info_id())) {
            String new_id = DaoUtils.getSqlTpl().selectOne("Job.getNextVal");
            if (StringUtils.isEmpty(new_id)) {
                new_id = "1";
            }
            //新增
            Class clazz = (Class) Class.forName(jobInfo.getJob_class_name());
            jobInfo.setJob_info_id(new_id);
            jobInfo.setJob_name(jobInfo.getJob_info_id() + "_" + clazz.getSimpleName());
            jobInfo.setJob_group(Scheduler.DEFAULT_GROUP);
            jobInfo.setCreate_date(DateUtil.getNow());

            SchedulerUtil.createScheduler(jobInfo, applicationContext, stdScheduler);
            //暂停任务
            if (Const.TRIGGER_STATE_PAUSED.equals(jobInfo.getTrigger_state())) {
                SchedulerUtil.pause(jobInfo, applicationContext, stdScheduler);
            }
            JobInfo jobInfoOri = new JobInfo();
            BeanUtils.copyProperties(jobInfoOri, jobInfo);
            DaoUtils.getSqlTpl().insert("Job.insertJobInfo", jobInfo);
            result.setResult(jobInfoOri);
        } else {
            //修改
            SchedulerUtil.modifyScheduler(jobInfo, jobInfo, applicationContext, stdScheduler);
            //暂停任务
            if (Const.TRIGGER_STATE_PAUSED.equals(jobInfo.getTrigger_state())) {
                SchedulerUtil.pause(jobInfo, applicationContext, stdScheduler);
            }

            Map<String, String> params = new HashMap<String, String>();
            params.put("job_name", jobInfo.getJob_name());
            params.put("job_group", jobInfo.getJob_group());
            String trigger_state = DaoUtils.getSqlTpl().selectOne("Job.queryTriggerState", params);
            //回填触发器信息
            TriggerKey triggerKey = TriggerKey.triggerKey(jobInfo.getJob_name(), jobInfo.getJob_group());
            CronTrigger trigger = (CronTrigger) stdScheduler.getTrigger(triggerKey);
            if (trigger == null) {
                result.setCodeInfo(Const.CODE_INFO.CODE_20102);
                result.setRes_message("任务触发器不存在");
                return result;
            }
            jobInfo.setNext_fire_time(DateUtil.format(trigger.getNextFireTime()));
            jobInfo.setPrev_fire_time(DateUtil.format(trigger.getPreviousFireTime()));
            jobInfo.setTrigger_state(trigger_state);

            JobInfo jobInfoOri = new JobInfo();
            BeanUtils.copyProperties(jobInfoOri, jobInfo);
            DaoUtils.getSqlTpl().insert("Job.updateJobInfo", jobInfo);
            result.setResult(jobInfoOri);
        }
        return result;
    }

    /**
     * 校验任务信息
     *
     * @param jobInfo
     * @return
     */
    public Map<String, Object> validateJobInfo(JobInfo jobInfo) {
        Map<String, Object> result = new HashMap<String, Object>();
        if (jobInfo == null) {
            result.put("job_info_name", "任务名称不能为空");
        } else {
            if (StringUtils.isBlank(jobInfo.getJob_info_name())) {
                result.put("job_info_name", "任务名称不能为空");
            }

            if (StringUtils.isBlank(jobInfo.getJob_class_name())) {
                result.put("job_class_name", "任务执行类不能为空");
            } else {
                try {
                    Class<?> clazz = Class.forName(jobInfo.getJob_class_name());
                    if (!Job.class.isAssignableFrom(clazz)) {
                        result.put("job_class_name", "任务执行类必须实现org.quartz.Job接口");
                    }
                } catch (ClassNotFoundException e) {
                    result.put("job_class_name", "任务执行类不存在");
                }
            }

            if (StringUtils.isBlank(jobInfo.getCron_expression())) {
                result.put("cron_expression", "时间表达式不能为空");
            } else {
                try {
                    CronScheduleBuilder.cronSchedule(jobInfo.getCron_expression());
                } catch (Exception e) {
                    result.put("cron_expression", "时间表达式格式错误(请按照quartz时间表达式规范配置)");
                }
            }
        }
        return result;
    }

    @Transactional
    public ResponseResult deleteJobInfo(Map<String, String> params) {
        String job_info_id = (String) params.get("job_info_id");
        String job_name = (String) params.get("job_name");
        String job_group = (String) params.get("job_group");
        ResponseResult result = new ResponseResult(Const.CODE_INFO.CODE_00000);
        if (StringUtils.isBlank(job_info_id)) {
            result.setCodeInfo(Const.CODE_INFO.CODE_20102);
            result.setRes_message("任务信息id不能为空");
            return result;
        }
        if (StringUtils.isBlank(job_name)) {
            result.setCodeInfo(Const.CODE_INFO.CODE_20102);
            result.setRes_message("job_name不能为空");
            return result;
        }
        if (StringUtils.isBlank(job_group)) {
            result.setCodeInfo(Const.CODE_INFO.CODE_20102);
            result.setRes_message("job_group不能为空");
            return result;
        }

        JobInfo jobInfo = new JobInfo();
        jobInfo.setJob_info_id(job_info_id);
        jobInfo.setJob_name(job_name);
        jobInfo.setJob_group(job_group);
        StdScheduler stdScheduler = SpringUtils.getBean("schedulerFactoryBean");
        SchedulerUtil.deleteScheduler(jobInfo, applicationContext, stdScheduler);
        DaoUtils.getSqlTpl().delete("Job.deleteJobInfo", job_info_id);

        return result;
    }

    @Transactional
    public ResponseResult pauseJob(Map<String, String> params) {
        String job_name = params.get("job_name");
        String job_group = params.get("job_group");
        ResponseResult result = new ResponseResult(Const.CODE_INFO.CODE_00000);

        if (StringUtils.isBlank(job_name)) {
            result.setCodeInfo(Const.CODE_INFO.CODE_20102);
            result.setRes_message("job_name不能为空");
            return result;
        }
        if (StringUtils.isBlank(job_group)) {
            result.setCodeInfo(Const.CODE_INFO.CODE_20102);
            result.setRes_message("job_group不能为空");
            return result;
        }

        JobInfo jobInfo = new JobInfo();
        jobInfo.setJob_name(job_name);
        jobInfo.setJob_group(job_group);
        StdScheduler stdScheduler = SpringUtils.getBean("schedulerFactoryBean");
        SchedulerUtil.pause(jobInfo, applicationContext, stdScheduler);

        String trigger_state = DaoUtils.getSqlTpl().selectOne("Job.queryTriggerState", params);
        result.setResult(trigger_state);

        return result;
    }

    @Transactional
    public ResponseResult resumeJob(Map<String, String> params) {
        String job_name = params.get("job_name");
        String job_group = params.get("job_group");
        ResponseResult result = new ResponseResult(Const.CODE_INFO.CODE_00000);
        if (StringUtils.isBlank(job_name)) {
            result.setCodeInfo(Const.CODE_INFO.CODE_20102);
            result.setRes_message("job_name不能为空");
            return result;
        }
        if (StringUtils.isBlank(job_group)) {
            result.setCodeInfo(Const.CODE_INFO.CODE_20102);
            result.setRes_message("job_group不能为空");
            return result;
        }

        JobInfo jobInfo = new JobInfo();
        jobInfo.setJob_name(job_name);
        jobInfo.setJob_group(job_group);
        StdScheduler stdScheduler = SpringUtils.getBean("schedulerFactoryBean");
        SchedulerUtil.resume(jobInfo, applicationContext, stdScheduler);

        String trigger_state = DaoUtils.getSqlTpl().selectOne("Job.queryTriggerState", params);
        result.setResult(trigger_state);

        return result;
    }

    @Transactional
    public ResponseResult triggerJob(Map<String, String> params) {
        String job_name = params.get("job_name");
        String job_group = params.get("job_group");
        ResponseResult result = new ResponseResult(Const.CODE_INFO.CODE_00000);
        if (StringUtils.isBlank(job_name)) {
            result.setCodeInfo(Const.CODE_INFO.CODE_20102);
            result.setRes_message("job_name不能为空");
            return result;
        }
        if (StringUtils.isBlank(job_group)) {
            result.setCodeInfo(Const.CODE_INFO.CODE_20102);
            result.setRes_message("job_group不能为空");
            return result;
        }
        JobInfo jobInfo = new JobInfo();
        jobInfo.setJob_name(job_name);
        jobInfo.setJob_group(job_group);
        StdScheduler stdScheduler = SpringUtils.getBean("schedulerFactoryBean");
        SchedulerUtil.triggerJob(jobInfo, applicationContext, stdScheduler);

        return result;
    }

    @Transactional
    public ResponseResult reloadJobInfo(Map<String, String> params) {
        ResponseResult result = new ResponseResult(Const.CODE_INFO.CODE_00000);
        return result;
    }
}

package com.ztesoft.springboot.domain;

import org.quartz.JobDataMap;

import java.io.Serializable;

@SuppressWarnings("serial")
public class JobInfo implements Serializable {

    private String job_info_id;
    private String job_info_name;
    private String start_now;
    private String create_date;
    private String job_name;
    private String job_group;
    private String job_class_name;
    private String description;
    private String cron_expression;
    private String next_fire_time;
    private String prev_fire_time;
    private String trigger_state;
    private String hosts;
    private JobDataMap jobDataMap;

    public String getJob_info_id() {
        return job_info_id;
    }

    public void setJob_info_id(String job_info_id) {
        this.job_info_id = job_info_id;
    }

    public String getJob_info_name() {
        return job_info_name;
    }

    public void setJob_info_name(String job_info_name) {
        this.job_info_name = job_info_name;
    }

    public String getStart_now() {
        return start_now;
    }

    public void setStart_now(String start_now) {
        this.start_now = start_now;
    }

    public String getCreate_date() {
        return create_date;
    }

    public void setCreate_date(String create_date) {
        this.create_date = create_date;
    }

    public String getJob_name() {
        return job_name;
    }

    public void setJob_name(String job_name) {
        this.job_name = job_name;
    }

    public String getJob_group() {
        return job_group;
    }

    public void setJob_group(String job_group) {
        this.job_group = job_group;
    }

    public String getJob_class_name() {
        return job_class_name;
    }

    public void setJob_class_name(String job_class_name) {
        this.job_class_name = job_class_name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCron_expression() {
        return cron_expression;
    }

    public void setCron_expression(String cron_expression) {
        this.cron_expression = cron_expression;
    }

    public String getNext_fire_time() {
        return next_fire_time;
    }

    public void setNext_fire_time(String next_fire_time) {
        this.next_fire_time = next_fire_time;
    }

    public String getPrev_fire_time() {
        return prev_fire_time;
    }

    public void setPrev_fire_time(String prev_fire_time) {
        this.prev_fire_time = prev_fire_time;
    }

    public String getTrigger_state() {
        return trigger_state;
    }

    public void setTrigger_state(String trigger_state) {
        this.trigger_state = trigger_state;
    }

    public String getHosts() {
        return hosts;
    }

    public void setHosts(String hosts) {
        this.hosts = hosts;
    }

    public JobDataMap getJobDataMap() {
        return jobDataMap;
    }

    public void setJobDataMap(JobDataMap jobDataMap) {
        this.jobDataMap = jobDataMap;
    }
}
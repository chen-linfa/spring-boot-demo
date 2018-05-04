package com.ztesoft.springboot.controller;

import com.ztesoft.springboot.common.Const;
import com.ztesoft.springboot.common.PageModel;
import com.ztesoft.springboot.common.message.ResponseResult;
import com.ztesoft.springboot.domain.JobInfo;
import com.ztesoft.springboot.service.JobService;
import org.apache.commons.beanutils.BeanUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("JobController")
@SuppressWarnings({"rawtypes", "unchecked"})
public class JobController {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private JobService jobService;

    /**
     * 查询任务信息列表
     *
     * @param params
     * @return
     */
    @RequestMapping(value = "/queryJobInfo", method = RequestMethod.POST)
    public PageModel<JobInfo> queryJobInfo(@RequestBody Map<String, Object> params) {
        return jobService.queryJobInfo(params);
    }

    /**
     * 保存任务信息
     *
     * @param params
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/saveJobInfo", method = RequestMethod.POST)
    public ResponseResult saveJobInfo(@RequestBody Map<String, Object> params) throws Exception {
        ResponseResult result = new ResponseResult(Const.CODE_INFO.CODE_00000);
        try {
            JobInfo jobInfo = new JobInfo();
            BeanUtils.populate(jobInfo, params);
            result = jobService.saveJobInfo(jobInfo);
        } catch (Exception e) {
            log.error("saveJobInfo", e);
            result.setCodeInfo(Const.CODE_INFO.CODE_30001);
            result.setRes_message(e.getMessage());
        }
        return result;
    }

    /**
     * 删除任务信息
     *
     * @param params
     * @return
     */
    @RequestMapping(value = "/deleteJobInfo", method = RequestMethod.POST)
    public ResponseResult deleteJobInfo(@RequestBody Map<String, String> params) {
        ResponseResult result = new ResponseResult(Const.CODE_INFO.CODE_00000);
        try {
            result = jobService.deleteJobInfo(params);
        } catch (Exception e) {
            log.error("deleteJobInfo", e);
            result.setCodeInfo(Const.CODE_INFO.CODE_30001);
            result.setRes_message(e.getMessage());
        }
        return result;
    }

    /**
     * 暂停任务
     *
     * @param params
     * @return
     */
    @RequestMapping(value = "/pauseJob", method = RequestMethod.POST)
    public ResponseResult pauseJob(@RequestBody Map<String, String> params) {
        ResponseResult result = new ResponseResult(Const.CODE_INFO.CODE_00000);
        try {
            result = jobService.pauseJob(params);
        } catch (Exception e) {
            log.error("pauseJob", e);
            result.setCodeInfo(Const.CODE_INFO.CODE_30001);
            result.setRes_message(e.getMessage());
        }
        return result;
    }

    /**
     * 恢复任务
     *
     * @param params
     * @return
     */
    @RequestMapping(value = "/resumeJob", method = RequestMethod.POST)
    public ResponseResult resumeJob(@RequestBody Map<String, String> params) {
        ResponseResult result = new ResponseResult(Const.CODE_INFO.CODE_00000);
        try {
            result = jobService.resumeJob(params);
        } catch (Exception e) {
            log.error("resumeJob", e);
            result.setCodeInfo(Const.CODE_INFO.CODE_30001);
            result.setRes_message(e.getMessage());
        }
        return result;
    }

    /**
     * 立即执行
     *
     * @param params
     * @return
     */
    @RequestMapping(value = "/triggerJob", method = RequestMethod.POST)
    public ResponseResult triggerJob(@RequestBody Map<String, String> params) {
        ResponseResult result = new ResponseResult(Const.CODE_INFO.CODE_00000);
        try {
            result = jobService.triggerJob(params);
        } catch (Exception e) {
            log.error("triggerJob", e);
            result.setCodeInfo(Const.CODE_INFO.CODE_30001);
            result.setRes_message(e.getMessage());
        }
        return result;
    }
}

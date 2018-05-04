package com.ztesoft.springboot.common;

import com.ztesoft.springboot.common.message.CodeInfo;

public class Const {
    /**
     * 编码类型
     */
    public static final String ENCODING_UTF8 = "UTF-8";
    public static final String ENCODING_GBK = "GBK";
    public static final String ENCODING_ISO88591 = "ISO8859-1";

    /**
     * JNDI名称
     **/
    public static final String DEFAULT_JNDI_NAME = "DEFAULT_JNDI";
    public static final String LOG_JNDI_NAME = "LOG_JNDI";

    public static final String VM_CONFIG_PATH = "CONFIG_PATH";// 通过vm参数配置的配置文件绝对路径的keyname

    /** AccessToken失效时间单位 **/
    public static final String TOKEN_EXP_UNIT_SECOND = "SECOND";// 秒
    public static final String TOKEN_EXP_UNIT_MINUTE = "MINUTE";// 分
    public static final String TOKEN_EXP_UNIT_HOUR = "HOUR";// 时
    public static final String TOKEN_EXP_UNIT_DAY = "DAY";// 天

    /** 定时任务状态 */
    public static final String TRIGGER_STATE_WAITING = "WAITING";
    public static final String TRIGGER_STATE_ACQUIRED = "ACQUIRED";
    public static final String TRIGGER_STATE_COMPLETE = "COMPLETE";
    public static final String TRIGGER_STATE_PAUSED = "PAUSED";
    public static final String TRIGGER_STATE_BLOCKED = "BLOCKED";
    public static final String TRIGGER_STATE_PAUSED_BLOCKED = "PAUSED_BLOCKED";
    public static final String TRIGGER_STATE_ERROR = "ERROR";

    /**
     * 应用编码规范
     */
    public static class CODE_INFO {

        /**
         * 服务调用成功
         */
        public static final CodeInfo CODE_00000 = new CodeInfo("00000", "Success", "服务调用成功");
        /**
         * 该请求必须用GET方法
         */
        public static final CodeInfo CODE_11001 = new CodeInfo("11001", "该请求必须用GET方法", "request method must be get");
        /**
         * 该请求必须用POST方法
         */
        public static final CodeInfo CODE_11002 = new CodeInfo("11002", "该请求必须用POST方法", "request method must be post");
        /**
         * 通用警告，内容自定义
         **/
        public static final CodeInfo CODE_14000 = new CodeInfo("14000", "${message}", "message:${message}");
        /**
         * 系统内部错误
         */
        public static final CodeInfo CODE_20001 = new CodeInfo("20001", "系统内部错误:${message}", "Server Error:${message}");
        /**
         * 非法的参数
         */
        public static final CodeInfo CODE_20102 = new CodeInfo("20102", "非法的参数", "Invalid Arguments");
        /**
         * 参数不能为空
         */
        public static final CodeInfo CODE_30001 = new CodeInfo("30001", "系统内部错误", "Server inner Error");

        public static final CodeInfo CODE_40000 = new CodeInfo("40000", "fail", "服务调用失败");
    }
}

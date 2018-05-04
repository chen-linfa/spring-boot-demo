package com.ztesoft.springboot.common.message;

import com.ztesoft.springboot.utils.StringUtils;

import java.io.Serializable;
import java.util.regex.Matcher;


@SuppressWarnings("serial")
public class CodeInfo implements Serializable {

    private String code;
    private String message;
    private String desc;

    public CodeInfo() {


    }

    public CodeInfo(String code, String message, String desc) {
        this.code = code;
        this.message = message;
        this.desc = desc;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public CodeInfo replaceMessage(String regex, String replacement) {
        if (!StringUtils.isBlank(message)) {
            if (replacement != null) {
                //特殊字符进行处理
                replacement = Matcher.quoteReplacement(replacement);
            } else {
                replacement = "null";
            }

            String _message = message.replaceAll("\\$\\{" + regex + "\\}", replacement);
            return new CodeInfo(code, _message, desc);
        }

        return this;
    }

    public CodeInfo replaceMessage(String regex, Throwable e) {
        if (!StringUtils.isBlank(message)) {
            String replacement = e.getMessage();
            if (StringUtils.isBlank(replacement) && e instanceof NullPointerException) {
                replacement = "NullPointerException";
            }
            replacement = replacement == null ? "null" : replacement;

            if (replacement != null) {
                //特殊字符进行处理
                replacement = Matcher.quoteReplacement(replacement);
            }

            String _message = message.replaceAll("\\$\\{" + regex + "\\}", replacement);
            return new CodeInfo(code, _message, desc);
        }

        return this;
    }

    public CodeInfo replaceDesc(String regex, String replacement) {
        if (!StringUtils.isBlank(desc)) {
            if (replacement != null) {
                //特殊字符进行处理
                replacement = Matcher.quoteReplacement(replacement);
            }

            String _desc = desc.replaceAll("\\$\\{" + regex + "\\}", replacement);
            return new CodeInfo(code, message, _desc);
        }

        return this;
    }
}
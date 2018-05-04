package com.ztesoft.springboot.common.message;

import com.ztesoft.springboot.common.Const;
import com.ztesoft.springboot.utils.StringUtils;

import java.io.Serializable;
import java.lang.reflect.InvocationTargetException;

@SuppressWarnings("serial")
public class ResponseCode implements Serializable {

    protected String res_code;
    protected String res_message;

    public ResponseCode() {

    }

    public ResponseCode(String res_code, String res_message) {
        this.res_code = res_code;
        this.res_message = res_message;
    }

    public ResponseCode(CodeInfo codeInfo) {
        if (codeInfo != null) {
            res_code = codeInfo.getCode();
            res_message = codeInfo.getMessage();
        }
    }

    public void setCodeInfo(CodeInfo codeInfo) {
        this.res_code = codeInfo.getCode();
        this.res_message = codeInfo.getMessage();
    }

    public void setException(Throwable e) {
        if (e instanceof CodeException) {
            CodeException codeException = (CodeException) e;
            this.res_code = codeException.getCode();
            this.res_message = codeException.getMessage();
        } else {
            String message = e.getMessage();
            if (StringUtils.isBlank(message)) {
                if (e instanceof NullPointerException) {
                    message = "NullPointerException";
                } else if (e instanceof InvocationTargetException) {
                    InvocationTargetException targetException = (InvocationTargetException) e;
                    if (targetException.getCause() != null) {
                        message = targetException.getCause().getMessage();
                    } else if (targetException.getTargetException() != null) {
                        message = targetException.getTargetException().getMessage();
                    }
                }
            }
            message = message == null ? "null" : message;

            CodeInfo codeInfo = null;
            try {
                codeInfo = Const.CODE_INFO.CODE_20001.replaceMessage("message", message);
            } catch (Exception ex) {
                //log.error(ex);
                codeInfo = Const.CODE_INFO.CODE_30001;
            }

            setCodeInfo(codeInfo);
        }
    }

    public String getRes_code() {
        return res_code;
    }

    public void setRes_code(String res_code) {
        this.res_code = res_code;
    }

    public String getRes_message() {
        return res_message;
    }

    public void setRes_message(String res_message) {
        this.res_message = res_message;
    }
}
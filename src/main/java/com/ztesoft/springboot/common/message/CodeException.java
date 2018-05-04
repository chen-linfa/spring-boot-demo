package com.ztesoft.springboot.common.message;

/**
 * 包含错误编码的异常
 */
@SuppressWarnings("serial")
public class CodeException extends RuntimeException {

    protected String code;

    public CodeException() {

    }

    public CodeException(String code, String message) {
        super(message);
        this.code = code;
    }

    public CodeException(CodeInfo codeInfo) {
        super(codeInfo.getMessage());
        this.code = codeInfo.getCode();
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
package com.ztesoft.springboot.common.message;

/**
 * 抛出包含错误编码的异常
 */
public class CodeError {

    public static void error(String code, String message) {
        throw new CodeException(code, message);
    }

    public static void error(CodeInfo codeInfo) {
        throw new CodeException(codeInfo);
    }
}
package com.ztesoft.springboot.common.message;

@SuppressWarnings("serial")
public class ResponseSuccess extends ResponseCode{
	
	protected boolean success;
	
	public ResponseSuccess(boolean success){
		this.success = success;
	}
	
	public boolean getSuccess(){
		return success;
	}
	
	public void setSuccess(boolean success){
		this.success = success;
	}
}

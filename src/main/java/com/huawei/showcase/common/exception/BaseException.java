package com.huawei.showcase.common.exception;

import com.huawei.showcase.common.enumcode.ResultCode;

public abstract class BaseException extends Exception
{
  private static final long serialVersionUID = 9065071603821975365L;
  private ResultCode resultCode;

  public BaseException(ResultCode resultCode)
  {
    setResultCode(resultCode);
  }

  public BaseException(ResultCode resultCode, Exception e)
  {
    super(e.getMessage(), e.getCause());
    setResultCode(resultCode);
  }

  public BaseException(ResultCode resultCode, String message)
  {
    super(message);
    setResultCode(resultCode);
  }

  public BaseException(ResultCode resultCode, Throwable cause)
  {
    super(cause);
    setResultCode(resultCode);
  }

  public BaseException(ResultCode resultCode, Throwable cause, String message)
  {
    super(message, cause);
    setResultCode(resultCode);
  }

  public ResultCode getResultCode()
  {
    return this.resultCode;
  }

  public void setResultCode(ResultCode resultCode)
  {
    this.resultCode = resultCode;
  }
}
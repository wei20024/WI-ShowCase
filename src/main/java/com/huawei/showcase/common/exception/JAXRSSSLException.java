package com.huawei.showcase.common.exception;

public class JAXRSSSLException extends RuntimeException
{
  private static final long serialVersionUID = 4114569931632056098L;

  public JAXRSSSLException()
  {
  }

  public JAXRSSSLException(String message, Throwable cause)
  {
    super(message, cause);
  }

  public JAXRSSSLException(String message)
  {
    super(message);
  }

  public JAXRSSSLException(Throwable cause)
  {
    super(cause);
  }
}
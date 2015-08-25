package com.huawei.showcase.common.enumcode;

public enum TokenAuthType
{
  LOGIN_SUCCESS(
    "1"), 

  LOGIN_EMERGENCY(
    "2"), 

  PASSWORD_EXPIRE(
    "3");

  private String code;

  private TokenAuthType(String code)
  {
    this.code = code;
  }

  public String getCode()
  {
    return this.code;
  }

  public void setCode(String code)
  {
    this.code = code;
  }
}
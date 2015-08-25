package com.huawei.showcase.common.enumcode;

public enum LoginType
{
  EXPLICIT(
    Integer.valueOf(0), "explicit"), 

  CERTIFICATE(
    Integer.valueOf(1), "certificate"), 

  CERTIFICATESSO(
    Integer.valueOf(2), "certificatesso"), 

  MISCELLANEOUS(
    Integer.valueOf(3), "miscellaneous");

  private Integer code;
  private String name;

  private LoginType(Integer code, String name)
  {
    this.code = code;
    this.name = name;
  }

  public Integer getCode()
  {
    return this.code;
  }

  public String getName()
  {
    return this.name;
  }
}
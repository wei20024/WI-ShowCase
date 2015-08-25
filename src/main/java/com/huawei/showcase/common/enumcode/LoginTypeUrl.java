package com.huawei.showcase.common.enumcode;

import com.huawei.showcase.common.util.CommonUtils;

public enum LoginTypeUrl
{
  EXPLICIT(
    0, "/pages/explicit.html"), 

  CERTIFICATE(
    1, "/pages/certificate.html"), 

  CERTIFICATESSO(
    2, "/pages/certificatesso.html"), 

  SMARTCARDGATEWAY(
    3, "/pages/smartcardgateway.html"), 

  FINGER(
    4, "/pages/finger.html"), 

  CAWSTLOGIN(
    7, "/pages/caloginwst.html"), 
  CALOGIN(
    5, "/pages/calogin.html"), 

  mobileLoginPage(
    9, "/pages/mobileAccessPages/mexplicit.html"), 

  DYNAMICLOGIN(
    6, "/pages/dynamicCode.html"), 

  INIT(
    -1, "/pages/init.do"), 
  LOGIN(
    -2, "/pages/login.do");

  private int code;
  private String name;

  private LoginTypeUrl(int code, String name)
  {
    this.code = code;
    this.name = name;
  }

  public int getCode()
  {
    return this.code;
  }

  public String getName()
  {
    return this.name;
  }

  public static String getName(int code)
  {
    for (LoginTypeUrl url : values())
    {
      if (url.getCode() == code)
      {
        return url.getName();
      }
    }
    return null;
  }

  public static boolean checkUrl(String requri)
  {
    if (CommonUtils.checkAllStringNull(new String[] { requri }))
    {
      return false;
    }

    for (LoginTypeUrl url : values())
    {
      if (requri.equalsIgnoreCase(url.getName()))
      {
        return true;
      }
    }

    return false;
  }
}
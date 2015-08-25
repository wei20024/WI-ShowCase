package com.huawei.showcase.common.enumcode;

import com.huawei.showcase.common.util.CommonUtils;
import java.util.ArrayList;
import java.util.List;

public enum GetConfigForbidKey
{
  GENERATE_OTP_API_PATH(
    10, "Generate_OTP_API_Path"), 

  DYNAMICPASSWORDRADIUSSERVERIP(
    9, "dynamicPassword.RadiusServerIP"), 

  WIIP(
    8, "wi.ip"), 

  WILDAPIP(
    7, "wi.ldap.ip"), 

  ITAIP(
    6, "ita.ip"), 

  DYNAMICPASSWORDRADIUSSECRET(
    5, "dynamicPassword.RadiusSecret"), 

  SVNIP(
    4, "svn.ip"), 

  FORBIDDCIPS(
    3, "forbid.dcips"), 

  VNCGATEIP(
    2, "vncgate.ip"), 

  DCIPS(
    1, "dcips"), 

  HDCIP(
    0, "hdc.ip");

  private static List<String> values;
  private int code;
  private String value;

  static { values = new ArrayList<String>();

    for (GetConfigForbidKey key : values())
    {
      values.add(key.getValue());
    }
  }

  private GetConfigForbidKey(int code, String value)
  {
    this.code = code;
    this.value = value;
  }

  public int getCode()
  {
    return this.code;
  }

  public void setCode(int code)
  {
    this.code = code;
  }

  public String getValue()
  {
    return this.value;
  }

  public void setValue(String value)
  {
    this.value = value;
  }

  public static boolean containKey(String key)
  {
    if (CommonUtils.checkAllStringNull(new String[] { key }))
    {
      return false;
    }

    if (values.contains(key))
    {
      return true;
    }

    return false;
  }
}
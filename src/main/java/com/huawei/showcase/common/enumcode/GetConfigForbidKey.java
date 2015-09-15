package com.huawei.showcase.common.enumcode;

import com.huawei.showcase.common.util.CommonUtils;
import java.util.ArrayList;
import java.util.List;

public enum GetConfigForbidKey
{
  GENERATE_OTP_API_PATH(
    0, "Uns.to.WI.password"), 

  DYNAMICPASSWORDRADIUSSERVERIP(
    1, "Uns.to.WI.userName"), 

  WIIP(2, "wi.ip"), 


  DYNAMICPASSWORDRADIUSSECRET(
    3, "Uns.to.WI.AuthType");

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
    if (CommonUtils.checkAllStringNull(key ))
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
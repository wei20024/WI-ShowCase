package com.huawei.showcase.common.enumcode;

import com.huawei.showcase.common.util.CommonUtils;
import java.util.ArrayList;
import java.util.List;

public enum CsrfCheckUrl
{
  LOGOUT(
    1, "/services/desktop/logout"), 

  CHANGEPWD(
    2, "/services/login/changepwd"), 

  GETVMLIST(
    3, "/services/desktop/getvmlist"), 

  GETVNCLOGININFO(
    4, "/services/desktop/getvnclogininfo"), 

  REBOOT(
    5, "/services/desktop/reboot"), 

  GETVMSPOWERSET(
    6, "/services/desktop/getvmspowerset"), 
  SETVMSPOWERSET(
    7, "/services/desktop/setvmspowerset"), 

  GETLOGININFO(
    8, "/services/desktop/getlogininfo"), 

  GETAPPLOGININFO(
    9,"/services/desktop/getApploginInfo"),
    	  
  DEALFAVORITEAPP(
    10,"/services/desktop/dealFavoriteApp"),
  EXCEPT_URL(
    11, "/services/api/");

  private static List<String> utls;
  private int code;
  private String name;

  static { utls = new ArrayList<String>();

    for (CsrfCheckUrl url : values())
    {
      utls.add(url.getName());
    }
  }

  private CsrfCheckUrl(int code, String name)
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
    for (CsrfCheckUrl url : values())
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
    if (CommonUtils.checkAllStringNull( requri ))
    {
      return false;
    }

    for (CsrfCheckUrl url : values())
    {
      if (requri.equalsIgnoreCase(url.getName()))
      {
        return true;
      }
    }

    return false;
  }

  public static boolean containUrl(String requri)
  {
    if (CommonUtils.checkAllStringNull( requri ))
    {
      return false;
    }

    if (requri.indexOf(EXCEPT_URL.getName()) > -1)
    {
      return false;
    }

    if (utls.contains(requri))
    {
      return true;
    }
    return false;
  }
}
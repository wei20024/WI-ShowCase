package com.huawei.showcase.common.enumcode;

import com.huawei.showcase.common.util.CommonUtils;
import java.util.ArrayList;
import java.util.List;

public enum CheckServiceUrl
{
  VMLIST(
    0, "/services/desktop/getvmlist"), 

  QUERY_VM_STATUS(
    1, "/services/desktop/queryVmStatus"), 

  LOGININFO(
    1, "/services/desktop/getlogininfo"), 

  VNCLOGININFO(
    2, "/services/desktop/getvnclogininfo"), 

  REBOOT(
    3, "/services/desktop/reboot"), 

  GETVMSPOWERSET(
    4, "/services/desktop/getvmspowerset"), 

  SETVMSPOWERSET(
    5, "/services/desktop/setvmspowerset"),
  
  GETAPPLOGININFO(
	6,"/services/desktop/getApploginInfo"),
  
  DEALFAVORITEAPP(
	7,"/services/desktop/dealFavoriteApp");

  private static List<String> utls;
  private int code;
  private String name;

  static 
  { 
	  utls = new ArrayList<String>();

    for (CheckServiceUrl url : values())
    {
      utls.add(url.getName());
    }
  }

  private CheckServiceUrl(int code, String name)
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
    for (CheckServiceUrl url : values())
    {
      if (url.getCode() == code)
      {
        return url.getName();
      }
    }
    return null;
  }

  public static boolean containUrl(String requri)
  {
    if (CommonUtils.checkAllStringNull(requri ))
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
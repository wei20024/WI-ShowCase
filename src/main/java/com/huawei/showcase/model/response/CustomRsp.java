package com.huawei.showcase.model.response;

import java.util.List;

public class CustomRsp extends CommonRsp
{
  private static final long serialVersionUID = 14567890L;
  private String extendData;
  private List<String> extendList;
  private String loginExtendInfo;

  public String getLoginExtendInfo()
  {
    return this.loginExtendInfo;
  }

  public void setLoginExtendInfo(String loginExtendInfo)
  {
    this.loginExtendInfo = loginExtendInfo;
  }

  public String getExtendData()
  {
    return this.extendData;
  }

  public void setExtendData(String extendData)
  {
    this.extendData = extendData;
  }

  public List<String> getExtendList()
  {
    return this.extendList;
  }

  public void setExtendList(List<String> extendList)
  {
    this.extendList = extendList;
  }
}
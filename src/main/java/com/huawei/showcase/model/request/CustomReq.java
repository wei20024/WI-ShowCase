package com.huawei.showcase.model.request;

import java.util.List;

public class CustomReq extends UnsCommonReq
{
  private static final long serialVersionUID = 14567890L;
  private String extendData;
  private List<String> extendList;

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
package com.huawei.showcase.model;

import java.util.List;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="WiAttachInfo")
public class WiAttachInfo
{
  private List<String> userList;
  private String wiName;

  public List<String> getUserList()
  {
    return this.userList;
  }

  public void setUserList(List<String> userList)
  {
    this.userList = userList;
  }

  public String getWiName()
  {
    return this.wiName;
  }

  public void setWiName(String wiName)
  {
    this.wiName = wiName;
  }
}
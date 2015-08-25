package com.huawei.showcase.model;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="UnsInfo")
public class UnsInfo
{
  private String unsId;
  private String unsName;
  private String unsConnUser;
  private String unsConnUserPwd;
  private String usnIp;
  private String usnPort;
  private String desc;
  private String style;
  private List<String> synTimeList = new ArrayList<String>();


  public String getUnsId()
  {
    return this.unsId;
  }

  public void setUnsId(String unsId)
  {
    this.unsId = unsId;
  }

  public String getUnsName()
  {
    return this.unsName;
  }

  public void setUnsName(String unsName)
  {
    this.unsName = unsName;
  }

  public String getUnsConnUser()
  {
    return this.unsConnUser;
  }

  public void setUnsConnUser(String unsConnUser)
  {
    this.unsConnUser = unsConnUser;
  }

  public String getUnsConnUserPwd()
  {
    return this.unsConnUserPwd;
  }

  public void setUnsConnUserPwd(String unsConnUserPwd)
  {
    this.unsConnUserPwd = unsConnUserPwd;
  }

  public String getUsnIp()
  {
    return this.usnIp;
  }

  public void setUsnIp(String usnIp)
  {
    this.usnIp = usnIp;
  }

  public String getUsnPort()
  {
    return this.usnPort;
  }

  public void setUsnPort(String usnPort)
  {
    this.usnPort = usnPort;
  }

  public String getDesc()
  {
    return this.desc;
  }

  public void setDesc(String desc)
  {
    this.desc = desc;
  }

  public String getStyle()
  {
    return this.style;
  }

  public void setStyle(String style)
  {
    this.style = style;
  }

  public List<String> getSynTimeList()
  {
    return this.synTimeList;
  }

  public void setSynTimeList(List<String> synTimeList)
  {
    this.synTimeList = synTimeList;
  }


}
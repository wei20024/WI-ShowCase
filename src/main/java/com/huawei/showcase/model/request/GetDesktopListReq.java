package com.huawei.showcase.model.request;

import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;


@XmlRootElement(name="GetDesktopListReq")
@XmlAccessorType(XmlAccessType.FIELD)
public class GetDesktopListReq extends CommonReq
{
  private static final long serialVersionUID = -181270736347165L;

  @XmlElement(name="userName")
  private String userName;

  @XmlElement(name="domain")
  private String domain;

  @XmlElement(name="userSid")
  private String sid;

  @XmlElement(name="userGroupList")
  private List<String> userGroupList;

  public String toString()
  {
    StringBuilder builder = new StringBuilder();
    builder.append("[WI>>HDC]req:userName=" + this.userName);
    builder.append(",domain=" + this.domain);
    builder.append(",sid=" + this.sid);
    builder.append(",userGroupList=" + this.userGroupList);
    return builder.toString();
  }

  public String getUserName()
  {
    return this.userName;
  }

  public void setUserName(String userName)
  {
    this.userName = userName;
  }

  public String getDomain()
  {
    return this.domain;
  }

  public void setDomain(String domain)
  {
    this.domain = domain;
  }

  public List<String> getUserGroupList()
  {
    return this.userGroupList;
  }

  public void setUserGroupList(List<String> userGroupList)
  {
    this.userGroupList = userGroupList;
  }

  public String getSid()
  {
    return this.sid;
  }

  public void setSid(String sid)
  {
    this.sid = sid;
  }
}
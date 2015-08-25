package com.huawei.showcase.model.request;

import com.huawei.showcase.model.UserGroupInfo;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="GetSessionByUserNameReq")
@XmlAccessorType(XmlAccessType.FIELD)
public class GetSessionByUserNameReq extends UnsCommonReq
{
  private static final long serialVersionUID = 3391204575586816504L;
  private String userName;
  private String domain;
  private UserGroupInfo userInfo;

  public String toString()
  {
    StringBuilder builder = new StringBuilder();
    builder.append("[WI>>HDC]QuerySessionInfoByUserName:userName=" + this.userName);
    builder.append(",domain=" + this.domain);
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

  public UserGroupInfo getUserInfo()
  {
    return this.userInfo;
  }

  public void setUserInfo(UserGroupInfo userInfo)
  {
    this.userInfo = userInfo;
  }
}
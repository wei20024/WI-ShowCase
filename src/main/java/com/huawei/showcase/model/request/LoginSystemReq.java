package com.huawei.showcase.model.request;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;


@XmlRootElement(name="LoginReq")
@XmlAccessorType(XmlAccessType.FIELD)
public class LoginSystemReq extends CustomReq
{
  private static final long serialVersionUID = -8501347916923280698L;

  @XmlElement(name="username")
  private String userName;

  @XmlElement(name="password")
  private String password;

  public String getUserName()
  {
    return this.userName;
  }

  public void setUserName(String userName)
  {
    this.userName = userName;
  }

  public String getPassword()
  {
    return this.password;
  }

  public void setPassword(String password)
  {
    this.password = password;
  }
}
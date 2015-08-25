package com.huawei.showcase.model;

import java.io.Serializable;

public class CurrentInfo
  implements Serializable
{
  private static final long serialVersionUID = -8501347916923280667L;
  private String userName;
  private String domain;
  private String password;

  public String toString()
  {
    return "userName = " + this.userName + " domain = " + this.domain;
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

  public String getPassword()
  {
    return this.password;
  }

  public void setPassword(String password)
  {
    this.password = password;
  }
}
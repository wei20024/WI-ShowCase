package com.huawei.showcase.model.request;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="ChangePwdReq")
@XmlAccessorType(XmlAccessType.FIELD)
public class ChangePwdReq extends CustomReq
{
  private static final long serialVersionUID = -8501347934923280698L;


  @XmlElement(name="username")
  private String username;


  @XmlElement(name="oldpwd")
  private String oldpwd;


  @XmlElement(name="newpwd")
  private String newpwd;


  @XmlElement(name="domain")
  private String domain;

  public String getOldpwd()
  {
    return this.oldpwd;
  }

  public void setOldpwd(String oldpwd)
  {
    this.oldpwd = oldpwd;
  }

  public String getNewpwd()
  {
    return this.newpwd;
  }

  public void setNewpwd(String newpwd)
  {
    this.newpwd = newpwd;
  }

  public String getDomain()
  {
    return this.domain;
  }

  public void setDomain(String domain)
  {
    this.domain = domain;
  }

  public String getUsername()
  {
    return this.username;
  }

  public void setUsername(String username)
  {
    this.username = username;
  }
}
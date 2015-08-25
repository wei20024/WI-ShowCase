package com.huawei.showcase.model.request;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;


@XmlRootElement(name="ChangePwdReq")
public class ChangePwdByITAReq extends UnsCommonReq
{

  /**
	 * 
	 */
	private static final long serialVersionUID = 6533577690622750582L;

@XmlElement(name="domain")
  private String domain;

  @XmlElement(name="newPassword")
  private String newpwd;

  @XmlElement(name="oldPassword")
  private String oldpwd;

  @XmlElement(name="username")
  private String wiusername;

  public String getDomain()
  {
    return this.domain;
  }

  public void setDomain(String domain)
  {
    this.domain = domain;
  }

  public String getNewpwd()
  {
    return this.newpwd;
  }

  public void setNewpwd(String newpwd)
  {
    this.newpwd = newpwd;
  }

  public String getOldpwd()
  {
    return this.oldpwd;
  }

  public void setOldpwd(String oldpwd)
  {
    this.oldpwd = oldpwd;
  }

  public String getWiusername()
  {
    return this.wiusername;
  }

  public void setWiusername(String wiusername)
  {
    this.wiusername = wiusername;
  }
}
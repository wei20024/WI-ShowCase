package com.huawei.showcase.model.response;


import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="ConfigurationRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class LoginTypeRsp extends CommonRsp
{
  private static final long serialVersionUID = 77747663051717435L;

  @XmlElement(name="loginType")
  private int logintype;

  public int getLogintype()
  {
    return this.logintype;
  }

  public void setLogintype(int logintype)
  {
    this.logintype = logintype;
  }
}
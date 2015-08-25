package com.huawei.showcase.model.response;


import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="UsernameRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class UsernameRsp extends CommonRsp
{
  private static final long serialVersionUID = 77747663051717435L;

  @XmlElement(name="username")
  private String loginusername;

  public String getLoginusername()
  {
    return this.loginusername;
  }

  public void setLoginusername(String loginusername)
  {
    this.loginusername = loginusername;
  }
}
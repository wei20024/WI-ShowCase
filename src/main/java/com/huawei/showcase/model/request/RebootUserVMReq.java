package com.huawei.showcase.model.request;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;


@XmlRootElement(name="RebootUserVMReq")
@XmlAccessorType(XmlAccessType.FIELD)
public class RebootUserVMReq extends UnsCommonReq
{

  /**
	 * 
	 */
	private static final long serialVersionUID = -4516614730795854640L;

@XmlElement(name="sid")
  private String sid;

  @XmlElement(name="isForceReboot")
  private Boolean isForceReboot;

  @XmlElement(name="userName")
  private String userName;

  @XmlElement(name="domain")
  private String domain;

  public String toString()
  {
    return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
  }

  public String getSid()
  {
    return this.sid;
  }

  public void setSid(String sid)
  {
    this.sid = sid;
  }

  public Boolean getIsForceReboot()
  {
    return this.isForceReboot;
  }

  public void setIsForceReboot(Boolean isForceReboot)
  {
    this.isForceReboot = isForceReboot;
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
}